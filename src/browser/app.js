import app from 'app';
import BrowserWindow from 'browser-window';
import { attachMenuToWindow } from './app-menu';

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
app.on('ready', function() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
  });

  attachMenuToWindow(app, mainWindow);

  // and load the index.html of the app.
  const entryBasePath = devMode ? 'http://localhost:8080' : ('file://' + __dirname);
  mainWindow.loadUrl(entryBasePath + '/static/index.html');

  // Open the devtools.
  mainWindow.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', () => mainWindow = null);

  mainWindow.maximize();
});
