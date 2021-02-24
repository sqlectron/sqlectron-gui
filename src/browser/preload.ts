/**
 * Expose remote modules to the renderer process.
 */
import { ipcRenderer, contextBridge } from 'electron';
import { Tab } from '../shared/types/tab';
import { SqlectronAPI } from '../shared/types/api';
import * as event from '../shared/event';

const sqlectronAPI: SqlectronAPI = {
  openWorkspaceWindow: (id: string) =>
    ipcRenderer.invoke(event.OPEN_WORKSPACE_WINDOW, id),
  tabStore: {
    loadTabs: (serverId: string, databaseName: string) =>
      ipcRenderer.invoke(event.TABSTORE_LOAD_TABS, serverId, databaseName),
    createTab: (serverId: string, databaseName: string, type: string) =>
      ipcRenderer.invoke(
        event.TABSTORE_CREATE_TAB,
        serverId,
        databaseName,
        type,
      ),
    loadTabContent: (tab: Tab) =>
      ipcRenderer.invoke(event.TABSTORE_LOAD_TAB_CONTENT, tab),
    saveTabContent: (tab: Tab, content: string) =>
      ipcRenderer.send(event.TABSTORE_SAVE_TAB_CONTENT, tab, content),
    removeTab: (tab: Tab) => ipcRenderer.invoke(event.TABSTORE_REMOVE_TAB, tab),
  },
  config: {
    load: () => ipcRenderer.invoke(event.CONFIG_LOAD),
  },
  db: {
    onConnection: (cb: (connEvent: string, serverId: string) => void) =>
      ipcRenderer.on(
        event.DB_CONNECTION,
        (event, connEvent: string, serverId: string) => cb(connEvent, serverId),
      ),
    listTables: () => ipcRenderer.invoke(event.DB_LIST_TABLES),
    listDatabases: () => ipcRenderer.invoke(event.DB_LIST_DATABASES),
    executeQuery: (query: string) =>
      ipcRenderer.invoke(event.DB_EXECUTE_QUERY, query),
    openDatabase: (databaseName: string) =>
      ipcRenderer.invoke(event.DB_OPEN_DATABASE, databaseName),
    connect: (
      id: string,
      databaseName: string,
      reconnecting: boolean,
      sshPassphrase: string,
    ) =>
      ipcRenderer.invoke(
        event.DB_CONNECT,
        id,
        databaseName,
        reconnecting,
        sshPassphrase,
      ),
  },
};

// Adds an object 'sqlectron' to the global window object:
contextBridge.exposeInMainWorld('sqlectron', sqlectronAPI);
