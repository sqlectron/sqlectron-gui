import ipc from 'ipc';
import app from 'app';
import BrowserWindow from 'browser-window';

const devMode = (process.argv || []).indexOf('--dev') !== -1;

// Report crashes to our server.
require('crash-reporter').start();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the javascript object is GCed.
let mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', ()  => {
  if (process.platform !== 'darwin') { app.quit(); }
});

// This method will be called when Electron has done everything
// initialization and ready for creating browser windows.
app.on('ready', function() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600
  });

  // and load the index.html of the app.
  const entryBasePath = devMode ? 'http://localhost:8080' : ('file://' + __dirname);
  mainWindow.loadUrl(entryBasePath + '/static/index.html');

  // Open the devtools.
  mainWindow.openDevTools();

  // Allow close the app by shortcut
  ipc.on('quit-app', () => app.quit());

  // Emitted when the window is closed.
  mainWindow.on('closed', () => mainWindow = null);
});
