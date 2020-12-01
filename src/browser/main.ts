import { app, BrowserWindow, ipcMain, IpcMainInvokeEvent } from 'electron';
import path from 'path';
import isDev from 'electron-is-dev';
import * as config from './config';
import * as core from './core';

// Conditionally include the dev tools installer to load React Dev Tools
let installExtension: any, REACT_DEVELOPER_TOOLS: any, REDUX_DEVTOOLS: any;

if (isDev) {
  const devTools = require('electron-devtools-installer');
  installExtension = devTools.default;
  REACT_DEVELOPER_TOOLS = devTools.REACT_DEVELOPER_TOOLS;
  REDUX_DEVTOOLS = devTools.REDUX_DEVTOOLS;
}

let mainWindow: Electron.BrowserWindow | null;
let workspaceWindow: Electron.BrowserWindow | null;

function openWorkspaceWindow() {
  if (!mainWindow) {
    throw new Error('mainWindow is null');
  }

  if (workspaceWindow) {
    console.log(
      'Skipping workspaceWindow creation, there is an instance already open',
    );
    return;
  }

  workspaceWindow = new BrowserWindow({
    parent: mainWindow,
    titleBarStyle: 'hiddenInset',
    // width: 900,
    // height: 680,
    webPreferences: {
      nativeWindowOpen: true,
      nodeIntegration: false, // is default value after Electron v5
      contextIsolation: true, // protect against prototype pollution
      enableRemoteModule: false, // turn off remote
      preload: path.resolve(__dirname, 'preload.js'),
    },
  });

  workspaceWindow?.once('ready-to-show', () => workspaceWindow?.maximize());
  workspaceWindow?.loadURL(
    isDev
      ? 'http://localhost:3000?connection=true'
      : `file://${path.join(__dirname, '../build/renderer/index.html')}`,
  );

  // Open the DevTools.
  if (isDev) {
    workspaceWindow?.webContents.openDevTools({ mode: 'detach' });
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    titleBarStyle: 'hiddenInset',
    width: 900,
    height: 680,
    webPreferences: {
      nativeWindowOpen: true,
      nodeIntegration: false, // is default value after Electron v5
      contextIsolation: true, // protect against prototype pollution
      enableRemoteModule: false, // turn off remote
      preload: path.resolve(__dirname, 'preload.js'),
    },
  });

  mainWindow.webContents.on(
    'new-window',
    (event, url, frameName, disposition, options, additionalFeatures) => {
      if (frameName === 'NewWindowComponent') {
        event.preventDefault();
        Object.assign(options, {
          titleBarStyle: 'hiddenInset',
          // modal: true,
          parent: mainWindow,
          height: 300,
          width: 300,
          title: '',
          center: true,
          resizable: false,
          minimizable: false,
          fullscreenable: false,
        });
        event.newGuest = new BrowserWindow(options);
      } else if (frameName === 'NewConnectionWindowComponent') {
        event.preventDefault();
        Object.assign(options, {
          // parent: mainWindow,
          // height: 600,
          // width: 800,
          title: '',
          // center: true,
          // resizable: false,
          // minimizable: false,
          // fullscreenable: false,
        });
        const win = new BrowserWindow(options);
        win.once('ready-to-show', () => win.maximize());
        win.loadURL(
          isDev
            ? 'http://localhost:3000?connection=true'
            : `file://${path.join(__dirname, '../build/renderer/index.html')}`,
        );
        // Open the DevTools.
        if (isDev) {
          win.webContents.openDevTools({ mode: 'detach' });
        }
        event.newGuest = win;
      }
    },
  );

  mainWindow.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/renderer/index.html')}`,
  );

  // Open the DevTools.
  if (isDev) {
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  }

  mainWindow.on('closed', () => (mainWindow = null));
}

app.on('ready', () => {
  ipcMain.handle('openNewConnectionWindow', async () => 'foo');
  ipcMain.handle('config.load', () => config.load(true));
  ipcMain.handle('db.listTables', () => core.listTables());
  ipcMain.handle(
    'db.executeQuery',
    (event: IpcMainInvokeEvent, query: string) => core.executeQuery(query),
  );
  ipcMain.handle(
    'db.connect',
    (
      event: IpcMainInvokeEvent,
      id: string,
      databaseName: string,
      reconnecting: boolean,
      sshPassphrase: string,
    ) =>
      core
        .connect(id, databaseName, reconnecting, sshPassphrase)
        .then((res: any) => {
          if (!res.error) {
            openWorkspaceWindow();
          }
          return res;
        }),
  );

  createWindow();

  if (isDev) {
    installExtension(REACT_DEVELOPER_TOOLS)
      .then((name: string) => console.log(`Added Extension:  ${name}`))
      .catch((error: Error) => console.log(`An error occurred: , ${error}`));

    installExtension(REDUX_DEVTOOLS)
      .then((name: string) => console.log(`Added Extension:  ${name}`))
      .catch((error: Error) => console.log(`An error occurred: , ${error}`));
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
