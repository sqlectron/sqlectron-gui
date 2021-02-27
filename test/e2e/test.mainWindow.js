const path = require('path');
const { expect } = require('chai');

const helper = require('./helper');

describe('MainWindow', function () {
  this.timeout(60000);

  before(async () => {
    const { app, mainWindow } = await helper.startApp({
      sqlectronHome: path.join(__dirname, '../fixtures/simple'),
    });

    this.app = app;
    this.mainWindow = mainWindow;
  });

  after(async () => {
    await helper.endApp(this.app);
  });

  it('script application', async () => {
    const appPath = await this.app.evaluate(({ app }) => {
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
    await this.mainWindow.waitForSelector('#server-list');

    const list = await this.mainWindow.$$('#server-list .header');
    expect(list).to.have.lengthOf(1);

    await helper.expectToEqualText(this.mainWindow, '#server-list .header', 'sqlectron-local-dev');
    await helper.expectToEqualText(this.mainWindow, '#server-list .meta', 'localhost:3306');
  });
});
