import electron from 'electron';
import path from 'path';
import fs from 'fs';

// Source: https://medium.com/cameron-nokes/how-to-store-user-data-in-electron-3ba6bf66bc1e
export default class Store {
  path: string;
  data: {
    [key: string]: unknown;
  };
  userDataPath: string;

  constructor({ configName, defaults }: { configName: string; defaults?: any }) {
    // Renderer process has to get `app` module via `remote`, whereas the main process can get it directly
    // app.getPath('userData') will return a string of the user's app data directory path.
    this.userDataPath = electron.app.getPath('userData');
    // We'll use the `configName` property to set the file name and path.join to bring it all together as a string
    this.path = path.join(this.userDataPath, configName + '.json');

    this.data = parseDataFile(this.path, defaults);
  }

  // This will just return the property on the `data` object
  get(key: string): unknown {
    return this.data[key];
  }

  // ...and this will set it
  set(key: string, val: unknown): void {
    this.data[key] = val;
    // Wait, I thought using the node.js' synchronous APIs was bad form?
    // We're not writing a server so there's not nearly the same IO demand on the process
    // Also if we used an async API and our app was quit before the asynchronous write had a chance to complete,
    // we might lose that data. Note that in a real app, we would try/catch this.
    fs.writeFileSync(this.path, JSON.stringify(this.data));
  }

  del(key: string): void {
    delete this.data[key];
    fs.writeFileSync(this.path, JSON.stringify(this.data));
  }
}

function parseDataFile(filePath: string, defaults: any) {
  // We'll try/catch it in case the file doesn't exist yet, which will be the case on the first application run.
  // `fs.readFileSync` will return a JSON string which we then parse into a Javascript object
  try {
    return JSON.parse(fs.readFileSync(filePath).toString());
  } catch (error) {
    // if there was some kind of error, return the passed in defaults instead.
    return defaults;
  }
}
