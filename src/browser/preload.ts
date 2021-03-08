/**
 * Expose remote modules to the renderer process.
 */
import { ipcRenderer, contextBridge } from 'electron';
import type { IpcMainInvokeEvent } from 'electron';
import type { SqlectronAPI, DialogFilter } from '../common/types/api';
import type { DatabaseFilter, SchemaFilter } from '../common/types/database';
import type { Server } from '../common/types/server';
import type { Config } from '../common/types/config';
import * as event from '../common/event';

const sqlectronAPI: SqlectronAPI = {
  db: {
    getClientsSync: () => ipcRenderer.sendSync(event.DB_GET_CLIENTS_SYNC),
    connect: (server: Server, database?: string) =>
      ipcRenderer.invoke(event.DB_CONNECT, server, database),
    disconnect: () => ipcRenderer.invoke(event.DB_DISCONNECT),
    listDatabases: (database: string, filter?: DatabaseFilter) =>
      ipcRenderer.invoke(event.DB_LIST_DATABASES, database, filter),
    listSchemas: (database: string, filter: SchemaFilter) =>
      ipcRenderer.invoke(event.DB_LIST_SCHEMAS, database, filter),
    listTables: (database: string, filter: SchemaFilter) =>
      ipcRenderer.invoke(event.DB_LIST_TABLES, database, filter),
    listViews: (database: string, filter: SchemaFilter) =>
      ipcRenderer.invoke(event.DB_LIST_VIEWS, database, filter),
    listRoutines: (database: string, filter: SchemaFilter) =>
      ipcRenderer.invoke(event.DB_LIST_ROUTINES, database, filter),
    listTableColumns: (database: string, table: string, schema?: string) =>
      ipcRenderer.invoke(event.DB_LIST_TABLE_COLUMNS, database, table, schema),
    listTableTriggers: (database: string, table: string, schema?: string) =>
      ipcRenderer.invoke(event.DB_LIST_TABLE_TRIGGERS, database, table, schema),
    listTableIndexes: (database: string, table: string, schema?: string) =>
      ipcRenderer.invoke(event.DB_LIST_TABLE_INDEXES, database, table, schema),
    getTableReferences: (database: string, table: string, schema?: string) =>
      ipcRenderer.invoke(event.DB_GET_TABLE_REFERENCES, database, table, schema),
    getTableKeys: (database: string, table: string, schema?: string) =>
      ipcRenderer.invoke(event.DB_GET_TABLE_KEYS, database, table, schema),
    createCancellableQuery: async (database: string, queryId: string, queryText: string) =>
      ipcRenderer.invoke(event.DB_CREATE_CANCELLABLE_QUERY, database, queryId, queryText),
    cancelCancellableQuery: async (queryId: string) =>
      ipcRenderer.invoke(event.DB_CANCEL_CANCELLABLE_QUERY, queryId),
    executeCancellableQuery: (queryId: string) =>
      ipcRenderer.invoke(event.DB_EXECUTE_CANCELLABLE_QUERY, queryId),
    executeQuery: (database: string, queryText: string) =>
      ipcRenderer.invoke(event.DB_EXECUTE_QUERY, database, queryText),
    getQuerySelectTop: (database: string, table: string, schema?: string, limit?: number) =>
      ipcRenderer.invoke(event.DB_GET_QUERY_SELECT_TOP, database, table, schema, limit),
    getTableCreateScript: (database: string, table: string, schema?: string) =>
      ipcRenderer.invoke(event.DB_GET_TABLE_CREATE_SCRIPT, database, table, schema),
    getTableSelectScript: (database: string, table: string, schema?: string) =>
      ipcRenderer.invoke(event.DB_GET_TABLE_SELECT_SCRIPT, database, table, schema),
    getTableInsertScript: (database: string, table: string, schema?: string) =>
      ipcRenderer.invoke(event.DB_GET_TABLE_INSERT_SCRIPT, database, table, schema),
    getTableUpdateScript: (database: string, table: string, schema?: string) =>
      ipcRenderer.invoke(event.DB_GET_TABLE_UPDATE_SCRIPT, database, table, schema),
    getTableDeleteScript: (database: string, table: string, schema?: string) =>
      ipcRenderer.invoke(event.DB_GET_TABLE_DELETE_SCRIPT, database, table, schema),
    getViewCreateScript: (database: string, view: string, schema?: string) =>
      ipcRenderer.invoke(event.DB_GET_VIEW_CREATE_SCRIPT, database, view, schema),
    getRoutineCreateScript: (database: string, routine: string, type: string, schema?: string) =>
      ipcRenderer.invoke(event.DB_GET_ROUTINE_CREATE_SCRIPT, database, routine, type, schema),
    truncateAllTables: (database: string, schema?: string) =>
      ipcRenderer.invoke(event.DB_TRUNCATE_ALL_TABLES, database, schema),
    getTableColumnNames: (database: string, table: string, schema?: string) =>
      ipcRenderer.invoke(event.DB_GET_TABLE_COLUMN_NAMES, database, table, schema),
    setSelectLimit: (limit: number) => ipcRenderer.invoke(event.DB_SET_SELECT_LIMIT, limit),
  },
  servers: {
    getAll: () => ipcRenderer.invoke(event.SERVERS_GET_ALL),
    add: (server: Server, cryptoSecret: string) =>
      ipcRenderer.invoke(event.SERVERS_ADD, server, cryptoSecret),
    update: (server: Server, cryptoSecret: string) =>
      ipcRenderer.invoke(event.SERVERS_UPDATE, server, cryptoSecret),
    addOrUpdate: (server: Server, cryptoSecret: string) =>
      ipcRenderer.invoke(event.SERVERS_ADD_OR_UPDATE, server, cryptoSecret),
    removeById: (id: string) => ipcRenderer.invoke(event.SERVERS_REMOVE_BY_ID, id),
    decryptSecrects: (server: Server, cryptoSecret: string) =>
      ipcRenderer.invoke(event.SERVERS_DECRYPT_SECRETS, server, cryptoSecret),
  },
  config: {
    prepare: (cryptoSecret: string) => ipcRenderer.invoke(event.CONFIG_PREPARE, cryptoSecret),
    path: () => ipcRenderer.invoke(event.CONFIG_PATH),
    get: () => ipcRenderer.invoke(event.CONFIG_GET),
    getFull: () => ipcRenderer.invoke(event.CONFIG_GET_FULL),
    getFullSync: () => ipcRenderer.sendSync(event.CONFIG_GET_FULL_SYNC),
    save: (data: Config) => ipcRenderer.invoke(event.CONFIG_SAVE, data),
    saveSettings: (data: Config) => ipcRenderer.invoke(event.CONFIG_SAVE_SETTINS, data),
  },
  logger: {
    error: (...args) => ipcRenderer.send(event.LOGGER_ERROR, ...args),
  },
  browser: {
    dialog: {
      showSaveDialog: (filters: Array<DialogFilter>) =>
        ipcRenderer.invoke(event.BROWSER_DIALOG_SHOW_SAVE_DIALOG, filters),
      showOpenDialog: (filters: Array<DialogFilter>, defaultPath?: string) =>
        ipcRenderer.invoke(event.BROWSER_DIALOG_SHOW_OPEN_DIALOG, filters, defaultPath),
    },

    fs: {
      saveFile: (filename: string, data: unknown, encoding?: string) =>
        ipcRenderer.invoke(event.BROWSER_FS_SAVE_FILE, filename, data, encoding),
      openFile: (filename: string) => ipcRenderer.invoke(event.BROWSER_FS_OPEN_FILE, filename),
    },

    menu: {
      buildContextMenuDatabaseItem: (options: {
        client: string;
        database: string;
        item: unknown;
        dbObjectType: string;
        event?: IpcMainInvokeEvent;
      }) => ipcRenderer.invoke(event.BROWSER_MENU_BUILD_CTX_MENU_DB_ITEM, options),
      popupContextMenuDatabaseItem: (x: number, y: number) =>
        ipcRenderer.invoke(event.BROWSER_MENU_POPUP_DB_ITEM, x, y),

      buildContextMenuDatabaseListItem: (options: {
        database: string;
        event?: IpcMainInvokeEvent;
      }) => ipcRenderer.invoke(event.BROWSER_MENU_BUILD_CTX_MENU_DB_LIST_ITEM, options),
      popupContextMenuDatabaseListItem: (x: number, y: number) =>
        ipcRenderer.invoke(event.BROWSER_MENU_POPUP_DB_LIST_ITEM, x, y),

      buildContextMenuTableCell: (options: {
        value: string | unknown;
        event?: IpcMainInvokeEvent;
      }) => ipcRenderer.invoke(event.BROWSER_MENU_BUILD_CTX_MENU_TABLE_CELL, options),
      popupContextMenuTableCell: (x: number, y: number) =>
        ipcRenderer.invoke(event.BROWSER_MENU_POPUP_TABLE_CELL, x, y),
      onPreviewTableCell: (cb: () => void) => ipcRenderer.on(event.BROWSER_MENU_OPEN_PREVIEW, cb),

      onZoomIn: (cb: () => void) => ipcRenderer.on(event.BROWSER_MENU_ZOOM_IN, cb),
      onZoomOut: (cb: () => void) => ipcRenderer.on(event.BROWSER_MENU_ZOOM_OUT, cb),
      onZoomReset: (cb: () => void) => ipcRenderer.on(event.BROWSER_MENU_ZOOM_RESET, cb),

      onQueryExecute: (cb: () => void) => ipcRenderer.on(event.BROWSER_MENU_QUERY_EXECUTE, cb),
      onNewTab: (cb: () => void) => ipcRenderer.on(event.BROWSER_MENU_QUERY_TAB_NEW, cb),
      onCloseTab: (cb: () => void) => ipcRenderer.on(event.BROWSER_MENU_QUERY_TAB_CLOSE, cb),
      onSaveQuery: (cb: () => void) => ipcRenderer.on(event.BROWSER_MENU_QUERY_SAVE, cb),
      onSaveQueryAs: (cb: () => void) => ipcRenderer.on(event.BROWSER_MENU_QUERY_SAVE_AS, cb),
      onOpenQuery: (cb: () => void) => ipcRenderer.on(event.BROWSER_MENU_QUERY_OPEN, cb),
      onQueryFocus: (cb: () => void) => ipcRenderer.on(event.BROWSER_MENU_QUERY_FOCUS, cb),
      onToggleDatabaseSearch: (cb: () => void) =>
        ipcRenderer.on(event.BROWSER_MENU_TOGGLE_DB_SEARCH, cb),
      onToggleDatabaObjectsSearch: (cb: () => void) =>
        ipcRenderer.on(event.BROWSER_MENU_TOGGLE_DB_OBJS_SEARCH, cb),
    },

    shell: {
      openExternal: (url: string) => ipcRenderer.invoke(event.BROWSER_SHELL_OPEN, url),
    },

    clipboard: {
      writeText: (text: string) => ipcRenderer.send(event.BROWSER_CLIPBOARD_WRITE, text),
    },

    webFrame: {
      setZoomFactor: (zoom: number) =>
        ipcRenderer.send(event.BROWSER_WEB_FRAME_SET_ZOOM_FACTOR, zoom),
    },
  },

  update: {
    checkUpdateAvailable: () => ipcRenderer.send(event.UPDATE_CHECK),
    // eslint-disable-next-line no-unused-vars
    onUpdateAvailable: (cb: (opts: { currentVersion: string; latestVersion: string }) => void) =>
      ipcRenderer.on(
        event.UPDATE_AVAILABLE,
        (_, opts: { currentVersion: string; latestVersion: string }) => cb(opts),
      ),
  },
};

// Adds an object 'sqlectron' to the global window object:
contextBridge.exposeInMainWorld('sqlectron', sqlectronAPI);
