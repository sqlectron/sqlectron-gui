import { ipcMain, IpcMainInvokeEvent, BrowserWindow } from 'electron';
import * as config from './config';
import * as core from './core';

export const registerIPCMainHandlers = ({
  openWorkspaceWindow,
}: {
  openWorkspaceWindow: (serverId: string) => void;
}) => {
  ipcMain.handle(
    'openWorkspaceWindow',
    async (event: IpcMainInvokeEvent, serverId: string) =>
      openWorkspaceWindow(serverId),
  );
  ipcMain.handle('config.load', () => config.load(true));
  ipcMain.handle('db.listTables', () => core.listTables());
  ipcMain.handle('db.listDatabases', () => core.listDatabases());
  ipcMain.handle(
    'db.executeQuery',
    (event: IpcMainInvokeEvent, query: string) => core.executeQuery(query),
  );
  ipcMain.handle(
    'db.openDatabase',
    (event: IpcMainInvokeEvent, databaseName: string) =>
      core.openDatabase(databaseName),
  );
  ipcMain.handle(
    'db.connect',
    (
      event: IpcMainInvokeEvent,
      id: string,
      databaseName: string,
      reconnecting: boolean,
      sshPassphrase: string,
    ) => core.connect(id, databaseName, reconnecting, sshPassphrase),
  );
};

export const sendConnectEvent = (win: BrowserWindow, serverId: string) => {
  console.log(win, serverId);
  win.webContents.send('db.connection', 'open', serverId);
};
