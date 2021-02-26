const path = require('path');

const helper = require('./helper');

describe('MainWindow', function () {
  beforeAll(async () => {
    const { app, mainWindow } = await helper.startApp({
      sqlectronHome: path.join(__dirname, '../fixtures/simple'),
    });

    this.app = app;
    this.mainWindow = mainWindow;
  });

  afterAll(async () => {
    await helper.endApp(this.app);
  });

  test('script application', async () => {
    const appPath = await this.app.evaluate(({ app }) => {
      // This runs in the main Electron process, first parameter is
      // the result of the require('electron') in the main app script.
      return app.getAppPath();
    });

    if (process.env.DEV_MODE === 'true') {
      expect(appPath).toBe(path.join(__dirname, '../../src/browser'));
    } else {
      expect(appPath).toBe(path.join(__dirname, '../../out/browser'));
    }
  });

  test('load servers from configuration file', async () => {
    await expect(this.mainWindow).toEqualText('#server-list .header', 'sqlectron-local-dev');
    await expect(this.mainWindow).toEqualText('#server-list .meta', 'localhost:3306');
  });
});
