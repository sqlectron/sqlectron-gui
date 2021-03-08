import * as db from 'sqlectron-db-core';
import { ADAPTERS } from 'sqlectron-db-core';
import { Database, setSelectLimit } from 'sqlectron-db-core/database';
import { QueryRowResult } from 'sqlectron-db-core/adapters/abstract_adapter';
import { DatabaseFilter, SchemaFilter } from 'sqlectron-db-core/filters';
import { Server as DBServer, LegacyServerConfig } from 'sqlectron-db-core/server';
import omit from 'lodash.omit';
import { Server } from '../../common/types/server';
import { SqlectronDB } from '../../common/types/api';

let serverSession: DBServer | null = null;
const cancellableQueries = {};

const getDB = (database: string): Database => {
  if (!database) {
    throw new Error('No database param');
  }

  const dbConn = serverSession?.db(database as string);
  if (!dbConn) {
    throw new Error(`No database found ${database}`);
  }

  return dbConn;
};

// Omit non-serializable objects because IPC calls cannot serialize them
export const DB_CLIENTS = ADAPTERS.map((c) => omit(c, 'adapter'));

// DatabaseFacade is a wrapper over the Database instance keeping all DB calls
// in the browser process
const DatabaseFacade: SqlectronDB = {
  getClientsSync: () => DB_CLIENTS,

  connect: async (server: Server, database?: string): Promise<void> => {
    const legacyServer = server as LegacyServerConfig;
    if (!serverSession) {
      serverSession = db.createServer(legacyServer);
    }

    let dbConn = serverSession.db(database as string);
    if (!dbConn) {
      dbConn = serverSession.createConnection(database);
    }

    if (!dbConn) {
      throw new Error('Could not connect to database');
    }

    await dbConn?.connect();
  },

  // TODO: support server disconnect -> serverSession.end();
  disconnect: (database?: string): Promise<void> =>
    Promise.resolve(getDB(database as string).disconnect()),

  listDatabases: (database: string, filter: DatabaseFilter): Promise<string[]> =>
    getDB(database).listDatabases(filter),

  listSchemas: (database: string, filter: SchemaFilter): Promise<string[]> =>
    getDB(database).listSchemas(filter),

  listTables: (database: string, filter: SchemaFilter): Promise<{ name: string }[]> => {
    return getDB(database).listTables(filter);
  },

  listViews: (database: string, filter: SchemaFilter): Promise<{ name: string }[]> => {
    return getDB(database).listViews(filter);
  },

  listRoutines: (
    database: string,
    filter: SchemaFilter,
  ): Promise<
    {
      schema?: string;
      routineName: string;
      routineType: string;
    }[]
  > => getDB(database).listRoutines(filter),

  listTableColumns: (
    database: string,
    table: string,
    schema?: string,
  ): Promise<
    {
      columnName: string;
      dataType: string;
    }[]
  > => getDB(database).listTableColumns(table, schema),

  listTableTriggers: (database: string, table: string, schema?: string): Promise<string[]> =>
    getDB(database).listTableTriggers(table, schema),

  listTableIndexes: (database: string, table: string, schema?: string): Promise<string[]> =>
    getDB(database).listTableIndexes(table, schema),

  getTableReferences: (database: string, table: string, schema?: string): Promise<string[]> =>
    getDB(database).getTableReferences(table, schema),

  getTableKeys: (
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
  > => getDB(database).getTableKeys(table, schema),

  createCancellableQuery: (database: string, queryId: string, queryText: string): Promise<void> => {
    cancellableQueries[queryId] = getDB(database).query(queryText);
    return Promise.resolve();
  },

  cancelCancellableQuery: async (queryId: string): Promise<void> => {
    const query = cancellableQueries[queryId];
    try {
      if (query) {
        await query.cancel();
      }
    } finally {
      delete cancellableQueries[queryId];
    }
  },

  executeCancellableQuery: async (queryId: string): Promise<QueryRowResult[]> => {
    try {
      const query = cancellableQueries[queryId];
      if (query) {
        const results = await query.execute();
        return results;
      }

      return [];
    } finally {
      delete cancellableQueries[queryId];
    }
  },

  executeQuery: (database: string, queryText: string): Promise<QueryRowResult[]> =>
    getDB(database).executeQuery(queryText),

  getQuerySelectTop: (database: string, table: string, schema?: string): Promise<string> =>
    getDB(database).getQuerySelectTop(table, schema),

  getTableCreateScript: (database: string, table: string, schema?: string): Promise<string[]> =>
    getDB(database).getTableCreateScript(table, schema),

  getTableSelectScript: (database: string, table: string, schema?: string): Promise<string> =>
    getDB(database).getTableSelectScript(table, schema),

  getTableInsertScript: (database: string, table: string, schema?: string): Promise<string> =>
    getDB(database).getTableInsertScript(table, schema),

  getTableUpdateScript: (database: string, table: string, schema?: string): Promise<string> =>
    getDB(database).getTableUpdateScript(table, schema),

  getTableDeleteScript: (database: string, table: string, schema?: string): Promise<string> =>
    getDB(database).getTableDeleteScript(table, schema),

  getViewCreateScript: (database: string, table: string, schema?: string): Promise<string[]> =>
    getDB(database).getViewCreateScript(table, schema),

  getRoutineCreateScript: (
    database: string,
    table: string,
    type: string,
    schema?: string,
  ): Promise<string[]> => getDB(database).getRoutineCreateScript(table, type, schema),

  truncateAllTables: (database: string, schema?: string): Promise<void> =>
    getDB(database).truncateAllTables(schema),

  getTableColumnNames: (database: string, table: string, schema?: string): Promise<string[]> =>
    getDB(database).getTableColumnNames(table, schema),

  setSelectLimit: (limit: number): void => setSelectLimit(limit),
};

export default DatabaseFacade;
