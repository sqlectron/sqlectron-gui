/**
 * Expose remote modules to the renderer process.
 */
import { ipcRenderer, contextBridge } from 'electron';
import { SqlectronAPI } from '../common/types/api';
import { DatabaseFilter, SchemaFilter } from '../common/types/database';
import { Server } from '../common/types/server';
import { Config } from '../common/types/config';
import * as event from '../common/event';

const sqlectronAPI: SqlectronAPI = {
  db: {
    getClientsSync: () => ipcRenderer.sendSync(event.DB_GET_CLIENTS_SYNC),
    handleSSHError: () => ipcRenderer.invoke(event.DB_HANDLE_SSH_ERROR),
    connect: (server: Server, database?: string) =>
      ipcRenderer.invoke(event.DB_CONNECT, server, database),
    checkIsConnected: () => ipcRenderer.invoke(event.DB_CHECK_IS_CONNECTED),
    disconnect: () => ipcRenderer.invoke(event.DB_DISCONNECT),
    getVersion: () => ipcRenderer.invoke(event.DB_GET_VERSION),
    listDatabases: (filter?: DatabaseFilter) => ipcRenderer.invoke(event.DB_LIST_DATABASES, filter),
    listSchemas: (filter: SchemaFilter) => ipcRenderer.invoke(event.DB_LIST_SCHEMAS, filter),
    listTables: (filter: SchemaFilter) => ipcRenderer.invoke(event.DB_LIST_TABLES, filter),
    listViews: (filter: SchemaFilter) => ipcRenderer.invoke(event.DB_LIST_VIEWS, filter),
    listRoutines: (filter: SchemaFilter) => ipcRenderer.invoke(event.DB_LIST_ROUTINES, filter),
    listTableColumns: (table: string, schema?: string) =>
      ipcRenderer.invoke(event.DB_LIST_TABLE_COLUMNS, table, schema),
    listTableTriggers: (table: string, schema?: string) =>
      ipcRenderer.invoke(event.DB_LIST_TABLE_TRIGGERS, table, schema),
    listTableIndexes: (table: string, schema?: string) =>
      ipcRenderer.invoke(event.DB_LIST_TABLE_INDEXES, table, schema),
    getTableReferences: (table: string, schema?: string) =>
      ipcRenderer.invoke(event.DB_GET_TABLE_REFERENCES, table, schema),
    getTableKeys: (table: string, schema?: string) =>
      ipcRenderer.invoke(event.DB_GET_TABLE_KEYS, table, schema),
    query: (queryText: string) => ipcRenderer.invoke(event.DB_QUERY, queryText),
    executeQuery: (queryText: string) => ipcRenderer.invoke(event.DB_EXECUTE_QUERY, queryText),
    getQuerySelectTop: (table: string, schema?: string, limit?: number) =>
      ipcRenderer.invoke(event.DB_GET_QUERY_SELECT_TOP, table, schema, limit),
    getTableCreateScript: (table: string, schema?: string) =>
      ipcRenderer.invoke(event.DB_GET_TABLE_CREATE_SCRIPT, table, schema),
    getTableSelectScript: (table: string, schema?: string) =>
      ipcRenderer.invoke(event.DB_GET_TABLE_SELECT_SCRIPT, table, schema),
    getTableInsertScript: (table: string, schema?: string) =>
      ipcRenderer.invoke(event.DB_GET_TABLE_INSERT_SCRIPT, table, schema),
    getTableUpdateScript: (table: string, schema?: string) =>
      ipcRenderer.invoke(event.DB_GET_TABLE_UPDATE_SCRIPT, table, schema),
    getTableDeleteScript: (table: string, schema?: string) =>
      ipcRenderer.invoke(event.DB_GET_TABLE_DELETE_SCRIPT, table, schema),
    getViewCreateScript: (view: string, schema?: string) =>
      ipcRenderer.invoke(event.DB_GET_VIEW_CREATE_SCRIPT, view, schema),
    getRoutineCreateScript: (routine: string, type: string, schema?: string) =>
      ipcRenderer.invoke(event.DB_GET_ROUTINE_CREATE_SCRIPT, routine, type, schema),
    truncateAllTables: (schema?: string) =>
      ipcRenderer.invoke(event.DB_TRUNCATE_ALL_TABLES, schema),
    getTableColumnNames: (table: string, schema?: string) =>
      ipcRenderer.invoke(event.DB_GET_TABLE_COLUMN_NAMES, table, schema),
    resolveSchema: (schema?: string) => ipcRenderer.invoke(event.DB_RESOLVE_SCHEMA, schema),
    wrap: (identifier: string) => ipcRenderer.invoke(event.DB_WRAP, identifier),
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
    getSync: () => ipcRenderer.sendSync(event.CONFIG_GET_SYNC),
    save: (data: Config) => ipcRenderer.invoke(event.CONFIG_SAVE, data),
    saveSettings: (data: Config) => ipcRenderer.invoke(event.CONFIG_SAVE_SETTINS, data),
  },
  logger: {
    error: (...args) => ipcRenderer.send(event.LOGGER_ERROR, ...args),
  },
};

// Adds an object 'sqlectron' to the global window object:
contextBridge.exposeInMainWorld('sqlectron', sqlectronAPI);
