import { resolve } from 'path';
import app from 'app';
import BrowserWindow from 'browser-window';
import { attachMenuToWindow } from './menu';
import { check as checkUpdate } from './update-checker';
import { productName } from '../../package.json';

const devMode = (process.argv || []).indexOf('--dev') !== -1;

// Report crashes to our server.
require('crash-reporter').start();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the javascript object is GCed.
let mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') { app.quit(); }
});

// This method will be called when Electron has done everything
// initialization and ready for creating browser windows.
app.on('ready', function onAppReady() {
  mainWindow = new BrowserWindow({
    title: productName,
    icon: resolve(__dirname, '..', '..', 'resources', 'app.png'),
    width: 1024,
    height: 700,
  });

  attachMenuToWindow(app, mainWindow);

  // and load the index.html of the app.
  const entryBasePath = devMode ? 'http://localhost:8080' : ('file://' + resolve(__dirname, '..'));
  mainWindow.loadURL(entryBasePath + '/static/index.html');

  // Emitted when the window is closed.
  mainWindow.on('closed', () => mainWindow = null);

  if (devMode) {
    mainWindow.openDevTools();
  }

  checkUpdate(mainWindow)
    .catch(err => console.error('Unable to check for updates', err));
});
