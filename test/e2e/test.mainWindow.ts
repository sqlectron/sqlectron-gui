import fs from 'fs';
import path from 'path';
import { expect } from 'chai';

import helper from './helper';
import type { ElectronApplication, Page } from 'playwright';

describe('MainWindow', function () {
  let app: ElectronApplication;
  let mainWindow: Page;

  before(async () => {
    // Makes a copy of the file, because the app writes to it during the startup
    // which has a slight different format than we use with prettier and it causes
    // an unecessary change to be commited everytime the test runs.
    fs.copyFileSync(
      path.join(__dirname, '../fixtures/simple/sqlectron-sample.json'),
      path.join(__dirname, '../fixtures/simple/sqlectron.json'),
    );

    const res = await helper.startApp({
      sqlectronHome: path.join(__dirname, '../fixtures/simple'),
    });

    app = res.app;
    mainWindow = res.mainWindow;
  });

  after(async () => {
    await helper.endApp(app);
  });

  it('script application', async () => {
    const appPath = await app.evaluate(({ app }) => {
      // This runs in the main Electron process, first parameter is
      // the result of the require('electron') in the main app script.
      return app.getAppPath();
    });

    if (process.env.DEV_MODE === 'true') {
      expect(appPath).to.be.equal(path.join(__dirname, '../../src/browser'));
    } else {
      expect(appPath).to.be.equal(path.join(__dirname, '../../out/browser'));
    }
  });

  it('load servers from configuration file', async () => {
    await mainWindow.waitForSelector('#server-list');

    const list = await mainWindow.$$('#server-list .header');
    expect(list).to.have.lengthOf(1);

    await helper.expectToEqualText(mainWindow, '#server-list .header', 'sqlectron-local-dev');
    await helper.expectToEqualText(mainWindow, '#server-list .meta', 'localhost:3306');
  });
});
