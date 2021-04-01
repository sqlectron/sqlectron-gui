import { WebContents, BrowserWindow, IpcMainInvokeEvent, IpcMainEvent } from 'electron';

import * as db from 'sqlectron-db-core';
import { ADAPTERS, setSelectLimit } from 'sqlectron-db-core';
import type {
  Database,
  Adapter,
  QueryRowResult,
  DatabaseFilter,
  SchemaFilter,
  Server as DBServer,
  LegacyServerConfig,
} from 'sqlectron-db-core';
import omit from 'lodash.omit';
import { Server } from '../../common/types/server';
import { SqlectronDB } from '../../common/types/api';

interface CancellableQuery {
  execute: () => Promise<QueryRowResult[]>;
  cancel: () => void;
}

// DatabaseFacade is a wrapper over the Database instance keeping all DB calls
// in the browser process
export default class DatabaseFacade implements SqlectronDB {
  private serverSession: DBServer | null;

  private cancellableQueries: {
    [queryId: string]: CancellableQuery;
  } = {};

  constructor() {
    this.serverSession = null;
  }

  private getDB(database: string): Database {
    // NOTE: No database will get a server connection using an unknown database
    const dbConn = this.serverSession?.db(database as string);
    if (!dbConn) {
      throw new Error(`No database found ${database}`);
    }

    return dbConn;
  }

  getClientsSync(): Array<Adapter> {
    // Omit non-serializable objects because IPC calls cannot serialize them
    return ADAPTERS.map((c) => omit(c, 'adapter'));
  }

  async connect(server: Server, database?: string): Promise<void> {
    const legacyServer = server as LegacyServerConfig;

    if (!this.serverSession) {
      this.serverSession = db.createServer(legacyServer);
    }

    let dbConn = this.serverSession.db(database as string);
    if (!dbConn) {
      dbConn = this.serverSession.createConnection(database);
    }

    if (!dbConn) {
      throw new Error('Could not connect to database');
    }

    try {
      await dbConn?.connect();
    } catch (err) {
      dbConn.disconnect();

      if (this.serverSession && Object.keys(this.serverSession.databases).length === 0) {
        this.serverSession.end();
        this.serverSession = null;
      }

      throw err;
    }
  }

  disconnectDatabse(database?: string): Promise<void> {
    return Promise.resolve(this.getDB(database as string).disconnect());
  }

  disconnectServer(): Promise<void> {
    if (this.serverSession) {
      this.serverSession.end();
    }
    this.serverSession = null;
    return Promise.resolve();
  }

  listDatabases(database: string, filter: DatabaseFilter): Promise<string[]> {
    return this.getDB(database).listDatabases(filter);
  }

  listSchemas(database: string, filter: SchemaFilter): Promise<string[]> {
    return this.getDB(database).listSchemas(filter);
  }

  listTables(database: string, filter: SchemaFilter): Promise<{ name: string }[]> {
    return this.getDB(database).listTables(filter);
  }

  listViews(database: string, filter: SchemaFilter): Promise<{ name: string }[]> {
    return this.getDB(database).listViews(filter);
  }

  listRoutines(
    database: string,
    filter: SchemaFilter,
  ): Promise<
    {
      schema?: string;
      routineName: string;
      routineType: string;
    }[]
  > {
    return this.getDB(database).listRoutines(filter);
  }

  listTableColumns(
    database: string,
    table: string,
    schema?: string,
  ): Promise<
    {
      columnName: string;
      dataType: string;
    }[]
  > {
    return this.getDB(database).listTableColumns(table, schema);
  }

  listTableTriggers(database: string, table: string, schema?: string): Promise<string[]> {
    return this.getDB(database).listTableTriggers(table, schema);
  }

  listTableIndexes(database: string, table: string, schema?: string): Promise<string[]> {
    return this.getDB(database).listTableIndexes(table, schema);
  }

  getTableReferences(database: string, table: string, schema?: string): Promise<string[]> {
    return this.getDB(database).getTableReferences(table, schema);
  }

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
  > {
    return this.getDB(database).getTableKeys(table, schema);
  }

  createCancellableQuery(database: string, queryId: string, queryText: string): Promise<void> {
    this.cancellableQueries[queryId] = this.getDB(database).query(queryText);
    return Promise.resolve();
  }

  async cancelCancellableQuery(queryId: string): Promise<void> {
    const query = this.cancellableQueries[queryId];
    try {
      if (query) {
        await query.cancel();
      }
    } finally {
      delete this.cancellableQueries[queryId];
    }
  }

  async executeCancellableQuery(queryId: string): Promise<QueryRowResult[]> {
    try {
      const query = this.cancellableQueries[queryId];
      if (query) {
        const results = await query.execute();
        return results;
      }

      return [];
    } finally {
      delete this.cancellableQueries[queryId];
    }
  }

  executeQuery(database: string, queryText: string): Promise<QueryRowResult[]> {
    return this.getDB(database).executeQuery(queryText);
  }

  getQuerySelectTop(database: string, table: string, schema?: string): Promise<string> {
    return this.getDB(database).getQuerySelectTop(table, schema);
  }

  getTableCreateScript(database: string, table: string, schema?: string): Promise<string[]> {
    return this.getDB(database).getTableCreateScript(table, schema);
  }

  getTableSelectScript(database: string, table: string, schema?: string): Promise<string> {
    return this.getDB(database).getTableSelectScript(table, schema);
  }

  getTableInsertScript(database: string, table: string, schema?: string): Promise<string> {
    return this.getDB(database).getTableInsertScript(table, schema);
  }

  getTableUpdateScript(database: string, table: string, schema?: string): Promise<string> {
    return this.getDB(database).getTableUpdateScript(table, schema);
  }

  getTableDeleteScript(database: string, table: string, schema?: string): Promise<string> {
    return this.getDB(database).getTableDeleteScript(table, schema);
  }

  getViewCreateScript(database: string, table: string, schema?: string): Promise<string[]> {
    return this.getDB(database).getViewCreateScript(table, schema);
  }

  getRoutineCreateScript(
    database: string,
    table: string,
    type: string,
    schema?: string,
  ): Promise<string[]> {
    return this.getDB(database).getRoutineCreateScript(table, type, schema);
  }

  truncateAllTables(database: string, schema?: string): Promise<void> {
    return this.getDB(database).truncateAllTables(schema);
  }

  getTableColumnNames(database: string, table: string, schema?: string): Promise<string[]> {
    return this.getDB(database).getTableColumnNames(table, schema);
  }

  setSelectLimit(limit: number): void {
    return setSelectLimit(limit);
  }
}

// Keep connections by BrowserWindow instances
const connections: {
  [windowId: string]: SqlectronDB;
} = {};

// Get connection based on the event source (BrowserWindow instance)
export const getConn = (e: IpcMainEvent | IpcMainInvokeEvent): SqlectronDB => {
  const sourceWindow = BrowserWindow.fromWebContents(e.sender as WebContents);
  if (!sourceWindow) {
    throw new Error('Could not resolve current window');
  }

  const windowId = sourceWindow.id;

  let conn = connections[windowId];
  if (!conn) {
    conn = new DatabaseFacade();
    connections[windowId] = conn;
  }

  return conn;
};
