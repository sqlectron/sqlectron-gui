const { electron } = require('playwright-electron');
const electronPath = require('electron');
const path = require('path');

const startApp = async ({ sqlectronHome }) => {
  // Start Electron application
  const electronConfig = {
    path: electronPath,
    args:
      process.env.DEV_MODE === 'true'
        ? [path.join(__dirname, '../../src/browser/main'), '--dev']
        : [path.join(__dirname, '../../out/browser/main')],
    env: {
      SQLECTRON_HOME: sqlectronHome,
    },
  };

  // if (process.env.CI === 'true') {
  //   electronConfig.path = 'xvb-run';
  //   electronConfig.args.unshift('-e /dev/stdout', electronPath);
  // }

  console.log('****electronConfig', electronConfig);

  const app = await electron.launch(electronPath, electronConfig);

  const mainWindow = await getAppPage(app);

  return { app, mainWindow };
};

const endApp = async (app) => {
  // After each test close Electron application.
  await app.close();
};

const wait = (time) => new Promise((resolve) => setTimeout(resolve, time));

const getAppPage = async (app, { waitAppLoad = true } = {}) => {
  // Attempt though 25 times waiting 1s between each attempt
  // to get the application page
  for (let attempt = 0; attempt < 25; attempt++) {
    const windows = await app.windows();
    for (let i = 0; i < windows.length; i++) {
      const page = windows[i];
      if ((await page.title()) === 'Sqlectron') {
        if (waitAppLoad) {
          // Wait until the app finished loading
          await page.waitForSelector('.ui');
        }

        return page;
      }
    }

    await wait(1000);
  }

  throw new Error('Could not find application page');
};

module.exports = {
  startApp,
  endApp,
  wait,
  getAppPage,
};
