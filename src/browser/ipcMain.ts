import { ipcMain, IpcMainInvokeEvent, IpcMainEvent } from 'electron';
import { config, servers, db } from './core';
import browser from './browser';
import { getConfig } from './config';
import createLogger from './logger';
import * as event from '../common/event';
import { Config } from '../common/types/config';
import { Server } from '../common/types/server';
import { DialogFilter } from '../common/types/api';
import { SchemaFilter, DatabaseFilter } from '../common/types/database';

const rendererLogger = createLogger('renderer');

/**
 * All possible IPC handled by the main process is defined in this module
 */

function registerConfigIPCMainHandlers() {
  ipcMain.handle(event.CONFIG_PREPARE, (e: IpcMainInvokeEvent, cryptoSecret: string) =>
    config.prepare(cryptoSecret),
  );
  ipcMain.handle(event.CONFIG_PATH, () => config.path());
  ipcMain.handle(event.CONFIG_GET, () => config.get());
  ipcMain.handle(event.CONFIG_GET_FULL, (e: IpcMainInvokeEvent, forceCleanCache?: boolean) =>
    Promise.resolve(getConfig(forceCleanCache)),
  );
  ipcMain.on(event.CONFIG_GET_FULL_SYNC, (e: IpcMainEvent, forceCleanCache?: boolean) => {
    e.returnValue = getConfig(forceCleanCache);
  });
  ipcMain.handle(event.CONFIG_SAVE, (e: IpcMainInvokeEvent, data: Config) => config.save(data));
  ipcMain.handle(event.CONFIG_SAVE_SETTINS, (e: IpcMainInvokeEvent, data: Config) =>
    config.saveSettings(data),
  );
}

function registerServersIPCMainHandlers() {
  ipcMain.handle(event.SERVERS_GET_ALL, () => servers.getAll());
  ipcMain.handle(event.SERVERS_ADD, (e: IpcMainInvokeEvent, server: Server, cryptoSecret: string) =>
    servers.add(server, cryptoSecret),
  );
  ipcMain.handle(
    event.SERVERS_UPDATE,
    (e: IpcMainInvokeEvent, server: Server, cryptoSecret: string) =>
      servers.update(server, cryptoSecret),
  );
  ipcMain.handle(
    event.SERVERS_ADD_OR_UPDATE,
    (e: IpcMainInvokeEvent, server: Server, cryptoSecret: string) =>
      servers.addOrUpdate(server, cryptoSecret),
  );
  ipcMain.handle(event.SERVERS_REMOVE_BY_ID, (e: IpcMainInvokeEvent, id: string) =>
    servers.removeById(id),
  );
  ipcMain.handle(
    event.SERVERS_DECRYPT_SECRETS,
    (e: IpcMainInvokeEvent, server: Server, cryptoSecret: string) =>
      servers.decryptSecrects(server, cryptoSecret),
  );
}

function registerLoggerIPCMainHandlers() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ipcMain.on(event.LOGGER_ERROR, (e: IpcMainEvent, ...args: any[]) => {
    rendererLogger.error(...args);
  });
}

function registerDBIPCMainHandlers() {
  ipcMain.on(event.DB_GET_CLIENTS_SYNC, (e: IpcMainEvent) => {
    e.returnValue = db.getClientsSync();
  });
  ipcMain.handle(event.DB_CONNECT, (e: IpcMainInvokeEvent, server: Server, database?: string) =>
    db.connect(server, database),
  );
  ipcMain.handle(event.DB_DISCONNECT, () => db.disconnect());
  ipcMain.handle(
    event.DB_LIST_DATABASES,
    (e: IpcMainInvokeEvent, database: string, filter: DatabaseFilter) =>
      db.listDatabases(database, filter),
  );
  ipcMain.handle(
    event.DB_LIST_SCHEMAS,
    (e: IpcMainInvokeEvent, database: string, filter: SchemaFilter) =>
      db.listSchemas(database, filter),
  );
  ipcMain.handle(
    event.DB_LIST_TABLES,
    (e: IpcMainInvokeEvent, database: string, filter: SchemaFilter) => {
      return db.listTables(database, filter);
    },
  );
  ipcMain.handle(
    event.DB_LIST_VIEWS,
    (e: IpcMainInvokeEvent, database: string, filter: SchemaFilter) =>
      db.listViews(database, filter),
  );
  ipcMain.handle(
    event.DB_LIST_ROUTINES,
    (e: IpcMainInvokeEvent, database: string, filter: SchemaFilter) =>
      db.listRoutines(database, filter),
  );
  ipcMain.handle(
    event.DB_LIST_TABLE_COLUMNS,
    (e: IpcMainInvokeEvent, database: string, table: string, schema?: string) =>
      db.listTableColumns(database, table, schema),
  );
  ipcMain.handle(
    event.DB_LIST_TABLE_TRIGGERS,
    (e: IpcMainInvokeEvent, database: string, table: string, schema?: string) =>
      db.listTableTriggers(database, table, schema),
  );
  ipcMain.handle(
    event.DB_LIST_TABLE_INDEXES,
    (e: IpcMainInvokeEvent, database: string, table: string, schema?: string) =>
      db.listTableIndexes(database, table, schema),
  );
  ipcMain.handle(
    event.DB_GET_TABLE_REFERENCES,
    (e: IpcMainInvokeEvent, database: string, table: string, schema?: string) =>
      db.getTableReferences(database, table, schema),
  );
  ipcMain.handle(
    event.DB_GET_TABLE_KEYS,
    (e: IpcMainInvokeEvent, database: string, table: string, schema?: string) =>
      db.getTableKeys(database, table, schema),
  );
  ipcMain.handle(
    event.DB_CREATE_CANCELLABLE_QUERY,
    (e: IpcMainInvokeEvent, database: string, queryId: string, queryText: string) =>
      db.createCancellableQuery(database, queryId, queryText),
  );
  ipcMain.handle(event.DB_CANCEL_CANCELLABLE_QUERY, (e: IpcMainInvokeEvent, queryId: string) =>
    db.cancelCancellableQuery(queryId),
  );
  ipcMain.handle(event.DB_EXECUTE_CANCELLABLE_QUERY, (e: IpcMainInvokeEvent, queryId: string) =>
    db.executeCancellableQuery(queryId),
  );
  ipcMain.handle(
    event.DB_EXECUTE_QUERY,
    (e: IpcMainInvokeEvent, database: string, queryText: string) =>
      db.executeQuery(database, queryText),
  );
  ipcMain.handle(
    event.DB_GET_QUERY_SELECT_TOP,
    (e: IpcMainInvokeEvent, database: string, table: string, schema?: string) =>
      db.getQuerySelectTop(database, table, schema),
  );
  ipcMain.handle(
    event.DB_GET_TABLE_CREATE_SCRIPT,
    (e: IpcMainInvokeEvent, database: string, table: string, schema?: string) =>
      db.getTableCreateScript(database, table, schema),
  );
  ipcMain.handle(
    event.DB_GET_TABLE_SELECT_SCRIPT,
    (e: IpcMainInvokeEvent, database: string, table: string, schema?: string) =>
      db.getTableSelectScript(database, table, schema),
  );
  ipcMain.handle(
    event.DB_GET_TABLE_INSERT_SCRIPT,
    (e: IpcMainInvokeEvent, database: string, table: string, schema?: string) =>
      db.getTableInsertScript(database, table, schema),
  );
  ipcMain.handle(
    event.DB_GET_TABLE_UPDATE_SCRIPT,
    (e: IpcMainInvokeEvent, database: string, table: string, schema?: string) =>
      db.getTableUpdateScript(database, table, schema),
  );
  ipcMain.handle(
    event.DB_GET_TABLE_DELETE_SCRIPT,
    (e: IpcMainInvokeEvent, database: string, table: string, schema?: string) =>
      db.getTableDeleteScript(database, table, schema),
  );
  ipcMain.handle(
    event.DB_GET_VIEW_CREATE_SCRIPT,
    (e: IpcMainInvokeEvent, database: string, table: string, schema?: string) =>
      db.getViewCreateScript(database, table, schema),
  );
  ipcMain.handle(
    event.DB_GET_ROUTINE_CREATE_SCRIPT,
    (e: IpcMainInvokeEvent, database: string, table: string, type: string, schema?: string) =>
      db.getRoutineCreateScript(database, table, type, schema),
  );
  ipcMain.handle(
    event.DB_TRUNCATE_ALL_TABLES,
    (e: IpcMainInvokeEvent, database: string, schema?: string) =>
      db.truncateAllTables(database, schema),
  );
  ipcMain.handle(
    event.DB_GET_TABLE_COLUMN_NAMES,
    (e: IpcMainInvokeEvent, database: string, table: string, schema?: string) =>
      db.getTableColumnNames(database, table, schema),
  );
  ipcMain.handle(event.DB_SET_SELECT_LIMIT, (e: IpcMainInvokeEvent, limit: number) =>
    db.setSelectLimit(limit),
  );
}

function registerBrowserIPCMainHandlers() {
  // Dialog events
  ipcMain.handle(
    event.BROWSER_DIALOG_SHOW_SAVE_DIALOG,
    (e: IpcMainInvokeEvent, filters: Array<DialogFilter>) => browser.dialog.showSaveDialog(filters),
  );
  ipcMain.handle(
    event.BROWSER_DIALOG_SHOW_OPEN_DIALOG,
    (e: IpcMainInvokeEvent, filters: Array<DialogFilter>, defaultPath: string) =>
      browser.dialog.showOpenDialog(filters, defaultPath),
  );

  // FS events
  ipcMain.handle(
    event.BROWSER_FS_SAVE_FILE,
    (e: IpcMainInvokeEvent, filename: string, data: unknown, encoding?: string) =>
      browser.fs.saveFile(filename, data, encoding),
  );
  ipcMain.handle(event.BROWSER_FS_OPEN_FILE, (e: IpcMainInvokeEvent, filename: string) =>
    browser.fs.openFile(filename),
  );

  // Menug events
  ipcMain.handle(
    event.BROWSER_MENU_BUILD_CTX_MENU_DB_ITEM,
    (
      e: IpcMainInvokeEvent,
      options: {
        client: string;
        database: string;
        item: unknown;
        dbObjectType: string;
        event: IpcMainInvokeEvent;
      },
    ) => browser.menu.buildContextMenuDatabaseItem({ ...options, event: e }),
  );
  ipcMain.handle(event.BROWSER_MENU_POPUP_DB_ITEM, (e: IpcMainInvokeEvent, x: number, y: number) =>
    browser.menu.popupContextMenuDatabaseItem(x, y),
  );

  ipcMain.handle(
    event.BROWSER_MENU_BUILD_CTX_MENU_DB_LIST_ITEM,
    (e: IpcMainInvokeEvent, options: { database: string }) =>
      browser.menu.buildContextMenuDatabaseListItem({ ...options, event: e }),
  );
  ipcMain.handle(
    event.BROWSER_MENU_POPUP_DB_LIST_ITEM,
    (e: IpcMainInvokeEvent, x: number, y: number) =>
      browser.menu.popupContextMenuDatabaseListItem(x, y),
  );

  ipcMain.handle(event.BROWSER_MENU_BUILD_CTX_MENU_TABLE_CELL, (e: IpcMainInvokeEvent) =>
    browser.menu.buildContextMenuTableCell({ event: e }),
  );
  ipcMain.handle(
    event.BROWSER_MENU_POPUP_TABLE_CELL,
    (e: IpcMainInvokeEvent, x: number, y: number) => browser.menu.popupContextMenuTableCell(x, y),
  );

  // Menu zoom events
  ipcMain.on(event.BROWSER_MENU_ZOOM_IN, (_, cb: () => void) => browser.menu.onZoomIn(cb));
  ipcMain.on(event.BROWSER_MENU_ZOOM_OUT, (_, cb: () => void) => browser.menu.onZoomOut(cb));
  ipcMain.on(event.BROWSER_MENU_ZOOM_RESET, (_, cb: () => void) => browser.menu.onZoomReset(cb));

  // Menu query events
  ipcMain.on(event.BROWSER_MENU_QUERY_EXECUTE, (_, cb: () => void) =>
    browser.menu.onQueryExecute(cb),
  );
  ipcMain.on(event.BROWSER_MENU_QUERY_TAB_NEW, (_, cb: () => void) => browser.menu.onNewTab(cb));
  ipcMain.on(event.BROWSER_MENU_QUERY_TAB_CLOSE, (_, cb: () => void) =>
    browser.menu.onCloseTab(cb),
  );
  ipcMain.on(event.BROWSER_MENU_QUERY_SAVE, (_, cb: () => void) => browser.menu.onSaveQuery(cb));
  ipcMain.on(event.BROWSER_MENU_QUERY_SAVE_AS, (_, cb: () => void) =>
    browser.menu.onSaveQueryAs(cb),
  );
  ipcMain.on(event.BROWSER_MENU_QUERY_OPEN, (_, cb: () => void) => browser.menu.onOpenQuery(cb));
  ipcMain.on(event.BROWSER_MENU_QUERY_FOCUS, (_, cb: () => void) => browser.menu.onQueryFocus(cb));
  ipcMain.on(event.BROWSER_MENU_TOGGLE_DB_SEARCH, (_, cb: () => void) =>
    browser.menu.onToggleDatabaseSearch(cb),
  );
  ipcMain.on(event.BROWSER_MENU_TOGGLE_DB_OBJS_SEARCH, (_, cb: () => void) =>
    browser.menu.onToggleDatabaObjectsSearch(cb),
  );

  // Shell events
  ipcMain.handle(event.BROWSER_SHELL_OPEN, (_, url: string) => browser.shell.openExternal(url));

  // Clipboard events
  ipcMain.on(event.BROWSER_CLIPBOARD_WRITE, (_, text: string) => browser.clipboard.writeText(text));

  // WebFrame events
  ipcMain.on(event.BROWSER_WEB_FRAME_SET_ZOOM_FACTOR, (e: IpcMainEvent, zoom: number) =>
    browser.webFrame.setZoomFactor(zoom, e),
  );
}

export const registerIPCMainHandlers = (): void => {
  registerConfigIPCMainHandlers();
  registerServersIPCMainHandlers();
  registerLoggerIPCMainHandlers();
  registerDBIPCMainHandlers();
  registerBrowserIPCMainHandlers();
};
