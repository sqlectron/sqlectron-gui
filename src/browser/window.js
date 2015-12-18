import { resolve } from 'path';
import BrowserWindow from 'browser-window';
import { attachMenuToWindow } from './menu';
import { check as checkUpdate } from './update-checker';
import { productName } from '../../package.json';


const devMode = (process.argv || []).indexOf('--dev') !== -1;


// Report crashes to our server.
require('crash-reporter').start();


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the javascript object is GCed.
const WINDOWS = {};


// Indicate the number of windows has already been opened.
// Also used as identifier to for each window.
let windowsNumber = 0;


export function buildNewWindow(app) {
  windowsNumber += 1;
  const mainWindow = new BrowserWindow({
    title: productName,
    icon: resolve(__dirname, '..', '..', 'resources', 'app.png'),
    width: 1024,
    height: 700,
    minWidth: 512,
    minHeight: 350,
  });

  attachMenuToWindow(app, mainWindow, buildNewWindow);

  // and load the index.html of the app.
  const entryBasePath = devMode ? 'http://localhost:8080' : ('file://' + resolve(__dirname, '..'));
  mainWindow.loadURL(entryBasePath + '/static/index.html');

  // Emitted when the window is closed.
  mainWindow.on('closed', () => delete WINDOWS[windowsNumber]);

  if (devMode) {
    mainWindow.openDevTools();
  }

  checkUpdate(mainWindow)
    .catch(err => console.error('Unable to check for updates', err));
}
