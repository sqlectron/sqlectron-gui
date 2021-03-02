import { ipcMain, IpcMainInvokeEvent, IpcMainEvent } from 'electron';
import { CLIENTS } from 'sqlectron-db-core';
import { Database } from 'sqlectron-db-core/database';
import { Server as DBServer, LegacyServerConfig } from 'sqlectron-db-core/server';
import omit from 'lodash.omit';
// import * as config from './config';
import { config, servers, db } from './core';
import { getConfig } from './config';
import createLogger from './logger';
import * as event from '../common/event';
import { Config } from '../common/types/config';
import { Server } from '../common/types/server';
import { SchemaFilter, DatabaseFilter } from '../common/types/database';

const rendererLogger = createLogger('renderer');

let serverSession: DBServer | null = null;
let dbConn: Database | null = null;

// Omit non-serializable objects because IPC calls cannot serialize them
const dbClients = CLIENTS.map((c) => omit(c, 'adapter'));
/**
 * All possible IPC handled by the main process is defined in this module
 */

function registerConfigIPCMainHandlers() {
  ipcMain.handle(event.CONFIG_PREPARE, (e: IpcMainInvokeEvent, cryptoSecret: string) =>
    config.prepare(cryptoSecret),
  );
  ipcMain.handle(event.CONFIG_PATH, () => config.path());
  ipcMain.handle(event.CONFIG_GET, () => config.get());
  ipcMain.on(event.CONFIG_GET_SYNC, (e: IpcMainEvent) => {
    e.returnValue = getConfig(false);
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
    e.returnValue = dbClients;
  });
  ipcMain.handle(event.DB_HANDLE_SSH_ERROR, () => dbConn?.handleSSHError());
  ipcMain.handle(event.DB_CHECK_IS_CONNECTED, () => dbConn?.checkIsConnected());
  ipcMain.handle(
    event.DB_CONNECT,
    async (e: IpcMainInvokeEvent, server: Server, database?: string) => {
      const legacyServer = server as LegacyServerConfig;
      serverSession = db.createServer(legacyServer);

      dbConn = serverSession.db(database as string);
      if (!dbConn) {
        dbConn = serverSession.createConnection(database);
      }

      if (!dbConn) {
        throw new Error('Could not connect to database');
      }

      await dbConn?.connect();
    },
  );
  ipcMain.handle(event.DB_DISCONNECT, () => dbConn?.disconnect());
  ipcMain.handle(event.DB_GET_VERSION, () => dbConn?.getVersion());
  ipcMain.handle(event.DB_LIST_DATABASES, (e: IpcMainInvokeEvent, filter: DatabaseFilter) =>
    dbConn?.listDatabases(filter),
  );
  ipcMain.handle(event.DB_LIST_SCHEMAS, (e: IpcMainInvokeEvent, filter: SchemaFilter) =>
    dbConn?.listSchemas(filter),
  );
  ipcMain.handle(event.DB_LIST_TABLES, (e: IpcMainInvokeEvent, filter: SchemaFilter) => {
    return dbConn?.listTables(filter);
  });
  ipcMain.handle(event.DB_LIST_VIEWS, (e: IpcMainInvokeEvent, filter: SchemaFilter) =>
    dbConn?.listViews(filter),
  );
  ipcMain.handle(event.DB_LIST_ROUTINES, (e: IpcMainInvokeEvent, filter: SchemaFilter) =>
    dbConn?.listRoutines(filter),
  );
  ipcMain.handle(
    event.DB_LIST_TABLE_COLUMNS,
    (e: IpcMainInvokeEvent, table: string, schema?: string) =>
      dbConn?.listTableColumns(table, schema),
  );
  ipcMain.handle(
    event.DB_LIST_TABLE_TRIGGERS,
    (e: IpcMainInvokeEvent, table: string, schema?: string) =>
      dbConn?.listTableTriggers(table, schema),
  );
  ipcMain.handle(
    event.DB_LIST_TABLE_INDEXES,
    (e: IpcMainInvokeEvent, table: string, schema?: string) =>
      dbConn?.listTableIndexes(table, schema),
  );
  ipcMain.handle(
    event.DB_GET_TABLE_REFERENCES,
    (e: IpcMainInvokeEvent, table: string, schema?: string) =>
      dbConn?.getTableReferences(table, schema),
  );
  ipcMain.handle(event.DB_GET_TABLE_KEYS, (e: IpcMainInvokeEvent, table: string, schema?: string) =>
    dbConn?.getTableKeys(table, schema),
  );
  ipcMain.handle(event.DB_QUERY, (e: IpcMainInvokeEvent, queryText: string) =>
    dbConn?.query(queryText),
  );
  ipcMain.handle(event.DB_EXECUTE_QUERY, (e: IpcMainInvokeEvent, queryText: string) =>
    dbConn?.executeQuery(queryText),
  );
  ipcMain.handle(
    event.DB_GET_QUERY_SELECT_TOP,
    (e: IpcMainInvokeEvent, table: string, schema?: string) =>
      dbConn?.getQuerySelectTop(table, schema),
  );
  ipcMain.handle(
    event.DB_GET_TABLE_CREATE_SCRIPT,
    (e: IpcMainInvokeEvent, table: string, schema?: string) =>
      dbConn?.getTableCreateScript(table, schema),
  );
  ipcMain.handle(
    event.DB_GET_TABLE_SELECT_SCRIPT,
    (e: IpcMainInvokeEvent, table: string, schema?: string) =>
      dbConn?.getTableSelectScript(table, schema),
  );
  ipcMain.handle(
    event.DB_GET_TABLE_INSERT_SCRIPT,
    (e: IpcMainInvokeEvent, table: string, schema?: string) =>
      dbConn?.getTableInsertScript(table, schema),
  );
  ipcMain.handle(
    event.DB_GET_TABLE_UPDATE_SCRIPT,
    (e: IpcMainInvokeEvent, table: string, schema?: string) =>
      dbConn?.getTableUpdateScript(table, schema),
  );
  ipcMain.handle(
    event.DB_GET_TABLE_DELETE_SCRIPT,
    (e: IpcMainInvokeEvent, table: string, schema?: string) =>
      dbConn?.getTableDeleteScript(table, schema),
  );
  ipcMain.handle(
    event.DB_GET_VIEW_CREATE_SCRIPT,
    (e: IpcMainInvokeEvent, table: string, schema?: string) =>
      dbConn?.getViewCreateScript(table, schema),
  );
  ipcMain.handle(
    event.DB_GET_ROUTINE_CREATE_SCRIPT,
    (e: IpcMainInvokeEvent, table: string, type: string, schema?: string) =>
      dbConn?.getRoutineCreateScript(table, type, schema),
  );
  ipcMain.handle(event.DB_TRUNCATE_ALL_TABLES, (e: IpcMainInvokeEvent, schema?: string) =>
    dbConn?.truncateAllTables(schema),
  );
  ipcMain.handle(
    event.DB_GET_TABLE_COLUMN_NAMES,
    (e: IpcMainInvokeEvent, table: string, schema?: string) =>
      dbConn?.getTableColumnNames(table, schema),
  );
  ipcMain.handle(event.DB_RESOLVE_SCHEMA, (e: IpcMainInvokeEvent, schema?: string) =>
    dbConn?.resolveSchema(schema),
  );
  ipcMain.handle(event.DB_WRAP, (e: IpcMainInvokeEvent, identifier: string) =>
    dbConn?.wrap(identifier),
  );
}

export const registerIPCMainHandlers = (): void => {
  registerConfigIPCMainHandlers();
  registerServersIPCMainHandlers();
  registerLoggerIPCMainHandlers();
  registerDBIPCMainHandlers();
};
