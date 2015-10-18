import fs from 'fs';
import path from 'path';
import { validate } from '../validators/server';


export async function loadServerListFromFile () {
  const filename = path.join(homedir(), '.sqlectron.json');
  if (!await fileExists(filename)) {
    await createFile(filename, { servers: [] });
  }
  const result = await readFile(filename);
  // TODO: Validate whole configuration file
  // if (!serversValidate(result)) {
  //   throw new Error('Invalid ~/.sqlectron.json file format');
  // }
  return result;
}



export async function addServer (server) {
  await validate(server);
  const filename = path.join(homedir(), '.sqlectron.json');

  const data = await readFile(filename);
  data.servers.push(server);
  await createFile(filename, data);

  return server;
}


export async function updateServer (id, server) {
  await validate(server);

  const filename = path.join(homedir(), '.sqlectron.json');
  const data = await readFile(filename);

  data.servers[id] = server;
  await createFile(filename, data);

  return server;
}



function fileExists (filename) {
  return new Promise(resolve => {
    fs.stat(filename, (err, stats) => {
      if (err) return resolve(false);
      resolve(stats.isFile());
    });
  });
}


function createFile (filename, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filename, JSON.stringify(data, null, 2), err => {
      if (err) return reject(err);
      resolve();
    });
  });
}


function readFile (filename) {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, (err, data) => {
      if (err) return reject(err);
      resolve(JSON.parse(data));
    });
  });
}


export function homedir() {
  return process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'];
}
