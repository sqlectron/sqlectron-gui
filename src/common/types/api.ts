import type { IpcMainInvokeEvent, IpcMainEvent } from 'electron';
import type { Config } from './config';
import type { Server } from './server';
import type { Adapter } from 'sqlectron-db-core/adapters';
import type { QueryRowResult } from 'sqlectron-db-core/adapters/abstract_adapter';
import type { SchemaFilter, DatabaseFilter } from 'sqlectron-db-core/filters';

export interface SqlectronConfig {
  prepare(cryptoSecret: string): Promise<void>;
  path(): Promise<string>;
  get(): Promise<Config>;
  getFull(forceCleanCache?: boolean): Promise<Config>;
  getFullSync(forceCleanCache?: boolean): Config;
  save(data: Config): Promise<void>;
  saveSettings(data: Config): Promise<void>;
}

export interface SqlectronLogger {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: (...args: any[]) => void;
}

export interface SqlectronDB {
  getClientsSync(): Array<Adapter>;
  connect(server?: Server, database?: string): Promise<void>;
  disconnect(database?: string): Promise<void>;
  listDatabases(database: string, filter?: DatabaseFilter): Promise<string[]>;
  listSchemas(database: string, filter: SchemaFilter): Promise<string[]>;
  listTables(database: string, filter: SchemaFilter): Promise<{ name: string }[]>;
  listViews(database: string, filter: SchemaFilter): Promise<{ name: string }[]>;
  listRoutines(
    database: string,
    filter: SchemaFilter,
  ): Promise<
    {
      schema?: string;
      routineName: string;
      routineType: string;
    }[]
  >;
  listTableColumns(
    database: string,
    table: string,
    schema?: string,
  ): Promise<
    {
      columnName: string;
      dataType: string;
    }[]
  >;
  listTableTriggers(database: string, table: string, schema?: string): Promise<string[]>;
  listTableIndexes(database: string, table: string, schema?: string): Promise<string[]>;
  getTableReferences(database: string, table: string, schema?: string): Promise<string[]>;
  getTableKeys(
    database: string,
    table: string,
    schema?: string,
  ): Promise<
    {
      columnName: string;
      keyType: string;
      constraintName: string | null;
      referencedTable: string | null;
    }[]
  >;
  createCancellableQuery(database: string, queryId: string, queryText: string): Promise<void>;
  cancelCancellableQuery(queryId: string): Promise<void>;
  executeCancellableQuery(queryId: string): Promise<QueryRowResult[]>;
  executeQuery(database: string, queryText: string): Promise<QueryRowResult[]>;
  getQuerySelectTop(
    database: string,
    table: string,
    schema?: string,
    limit?: number,
  ): Promise<string>;
  getTableCreateScript(database: string, table: string, schema?: string): Promise<string[]>;
  getTableSelectScript(database: string, table: string, schema?: string): Promise<string>;
  getTableInsertScript(database: string, table: string, schema?: string): Promise<string>;
  getTableUpdateScript(database: string, table: string, schema?: string): Promise<string>;
  getTableDeleteScript(database: string, table: string, schema?: string): Promise<string>;
  getViewCreateScript(database: string, view: string, schema?: string): Promise<string[]>;
  getRoutineCreateScript(
    database: string,
    routine: string,
    type: string,
    schema?: string,
  ): Promise<string[]>;
  truncateAllTables(database: string, schema?: string): Promise<void>;
  getTableColumnNames(database: string, table: string, schema?: string): Promise<string[]>;
  setSelectLimit(limit: number): void;
}

export interface SqlectronServers {
  getAll(): Promise<Array<Server>>;
  add(server: Server, cryptoSecret: string): Promise<Server>;
  update(server: Server, cryptoSecret: string): Promise<Server>;
  addOrUpdate(server: Server, cryptoSecret: string): Promise<Server>;
  removeById(id: string): Promise<void>;
  decryptSecrects(server: Server, cryptoSecret: string): Promise<Server>;
}

export interface DialogFilter {
  name: string;
  extensions: Array<string>;
}

export interface SqlectronBrowserDialog {
  showSaveDialog(filters: Array<DialogFilter>): Promise<string>;
  showOpenDialog(filters: Array<DialogFilter>, defaultPath?: string): Promise<string[]>;
}

export interface SqlectronBrowserFS {
  saveFile(filename: string, data: unknown, encoding?: string): Promise<void>;
  openFile(filename: string): Promise<string>;
}

export interface SqlectronBrowserMenu {
  buildContextMenuDatabaseItem({
    client,
    database,
    item,
    dbObjectType,
    event,
  }: {
    client: string;
    database: string;
    item: unknown;
    dbObjectType: string;
    event?: IpcMainInvokeEvent;
  }): void;
  popupContextMenuDatabaseItem(x: number, y: number): void;

  buildContextMenuDatabaseListItem({
    database,
    event,
  }: {
    database: string;
    event?: IpcMainInvokeEvent;
  }): void;
  popupContextMenuDatabaseListItem(x: number, y: number): void;

  buildContextMenuTableCell({ event }: { event?: IpcMainInvokeEvent }): void;
  popupContextMenuTableCell(x: number, y: number): void;
  onPreviewTableCell(cb: () => void): void;

  onZoomIn(cb: () => void): void;
  onZoomOut(cb: () => void): void;
  onZoomReset(cb: () => void): void;

  onQueryExecute(cb: () => void): void;
  onNewTab(cb: () => void): void;
  onCloseTab(cb: () => void): void;
  onSaveQuery(cb: () => void): void;
  onSaveQueryAs(cb: () => void): void;
  onOpenQuery(cb: () => void): void;
  onQueryFocus(cb: () => void): void;
  onToggleDatabaseSearch(cb: () => void): void;
  onToggleDatabaObjectsSearch(cb: () => void): void;
}

export interface SqlectronBrowserShell {
  openExternal(url: string): Promise<void>;
}

export interface SqlectronBrowserClipboard {
  writeText(text: string): void;
}

export interface SqlectronBrowserWebFrame {
  setZoomFactor(zoom: number, event?: IpcMainEvent): void;
}

export interface SqlectronUpdate {
  checkUpdateAvailable(): void;
  onUpdateAvailable(
    cb: ({
      currentVersion,
      latestVersion,
    }: {
      currentVersion: string;
      latestVersion: string;
    }) => void,
  ): void;
}

export interface SqlectronBrowser {
  dialog: SqlectronBrowserDialog;
  fs: SqlectronBrowserFS;
  menu: SqlectronBrowserMenu;
  shell: SqlectronBrowserShell;
  clipboard: SqlectronBrowserClipboard;
  webFrame: SqlectronBrowserWebFrame;
}
export interface SqlectronBrowser {
  dialog: SqlectronBrowserDialog;
  fs: SqlectronBrowserFS;
  menu: SqlectronBrowserMenu;
}

export interface SqlectronAPI {
  db: SqlectronDB;
  servers: SqlectronServers;
  config: SqlectronConfig;
  logger: SqlectronLogger;
  browser: SqlectronBrowser;
  update: SqlectronUpdate;
}
