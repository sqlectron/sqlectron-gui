import path from 'path';
import { expect } from 'chai';

import helper from './helper';

describe('MainWindow', function () {
  this.timeout(60000);

  let app;
  let mainWindow;

  before(async () => {
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
