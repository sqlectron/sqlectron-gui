import { ipcMain, IpcMainInvokeEvent, BrowserWindow } from 'electron';
import * as config from './config';
import * as db from './db';
import TabStore from './tabStore';
import { Tab } from '../shared/types/tab';
import * as event from '../shared/event';

/**
 * All possible IPC handled by the main process is defined in this module
 */

export const registerIPCMainHandlers = ({
  openWorkspaceWindow,
  tabStore,
}: {
  openWorkspaceWindow: (serverId: string) => void;
  tabStore: TabStore;
}) => {
  // General ipc handlers
  ipcMain.handle(
    event.OPEN_WORKSPACE_WINDOW,
    async (e: IpcMainInvokeEvent, serverId: string) =>
      openWorkspaceWindow(serverId),
  );

  // Config ipc handlers
  ipcMain.handle(event.CONFIG_LOAD, () => config.load(true));

  // DB ipc handlers
  ipcMain.handle(event.DB_LIST_TABLES, () => db.listTables());
  ipcMain.handle(event.DB_LIST_DATABASES, () => db.listDatabases());
  ipcMain.handle(
    event.DB_EXECUTE_QUERY,
    (e: IpcMainInvokeEvent, query: string) => db.executeQuery(query),
  );
  ipcMain.handle(
    event.DB_OPEN_DATABASE,
    (e: IpcMainInvokeEvent, databaseName: string) =>
      db.openDatabase(databaseName),
  );
  ipcMain.handle(
    event.DB_CONNECT,
    (
      e: IpcMainInvokeEvent,
      id: string,
      databaseName: string,
      reconnecting: boolean,
      sshPassphrase: string,
    ) => db.connect(id, databaseName, reconnecting, sshPassphrase),
  );

  // TabStore ipc handlers
  ipcMain.handle(
    event.TABSTORE_LOAD_TABS,
    (e: IpcMainInvokeEvent, serverId: string, databaseName: string) =>
      tabStore.loadTabs(serverId, databaseName),
  );
  ipcMain.handle(
    event.TABSTORE_CREATE_TAB,
    (
      e: IpcMainInvokeEvent,
      serverId: string,
      databaseName: string,
      type: string,
    ) => tabStore.createTab(serverId, databaseName, type),
  );
  ipcMain.handle(
    event.TABSTORE_LOAD_TAB_CONTENT,
    (e: IpcMainInvokeEvent, tab: Tab) => tabStore.loadTabContent(tab),
  );
  ipcMain.on(
    event.TABSTORE_SAVE_TAB_CONTENT,
    (event, tab: Tab, content: string) => tabStore.saveTabContent(tab, content),
  );
  ipcMain.handle(event.TABSTORE_REMOVE_TAB, (event, tab: Tab) =>
    tabStore.removeTab(tab),
  );
};

export const sendConnectEvent = (win: BrowserWindow, serverId: string) => {
  console.log(win, serverId);
  win.webContents.send(event.DB_CONNECTION, 'open', serverId);
};
