import { resolve } from 'path';
import { BrowserWindow } from 'electron'; // eslint-disable-line import/no-unresolved
import { attachMenuToWindow } from './menu';
import { check as checkUpdate } from './update-checker';
import { get as getConfig } from './config';
import createLogger from './logger';

const logger = createLogger('window');


const devMode = (process.argv || []).indexOf('--dev') !== -1;


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the javascript object is GCed.
const WINDOWS = {};


// Indicate the number of windows has already been opened.
// Also used as identifier to for each window.
let windowsNumber = 0;


export function buildNewWindow(app) {
  const appConfig = getConfig();

  windowsNumber += 1;
  const mainWindow = new BrowserWindow({
    title: appConfig.name,
    icon: resolve(__dirname, '..', '..', 'build', 'app.png'),
    width: 1024,
    height: 700,
    minWidth: 512,
    minHeight: 350,
    webPreferences: {
      preload: resolve(__dirname, 'preload.js'),
    },
  });

  attachMenuToWindow(app, buildNewWindow, appConfig);

  // and load the index.html of the app.
  const entryBasePath = devMode ? 'http://localhost:8080' : ('file://' + resolve(__dirname, '..'));
  mainWindow.loadURL(entryBasePath + '/static/index.html');

  // Emitted when the window is closed.
  mainWindow.on('closed', () => delete WINDOWS[windowsNumber]);

  if (devMode) {
    mainWindow.openDevTools();
  }

  checkUpdate(mainWindow, appConfig)
    .catch(err => logger.error('Unable to check for updates', err));
}
