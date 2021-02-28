import { Config } from './config';
import { Server } from './server';
import { Adapter, AdapterVersion, DatabaseFilter, SchemaFilter, QueryRowResult } from './database';

export interface SqlectronConfig {
  prepare(cryptoSecret: string): Promise<void>;
  path(): Promise<string>;
  get(): Promise<Config>;
  getSync(): Config;
  save(data: Config): Promise<void>;
  saveSettings(data: Config): Promise<void>;
}

export interface SqlectronLogger {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: (...args: any[]) => void;
}

export interface SqlectronDB {
  getClientsSync(): Array<Adapter>;
  handleSSHError(): Promise<void>;
  checkIsConnected(): Promise<boolean>;
  connect(server?: Server, database?: string): Promise<void>;
  disconnect(): Promise<void>;
  getVersion(): Promise<AdapterVersion>;
  listDatabases(filter?: DatabaseFilter): Promise<string[]>;
  listSchemas(filter: SchemaFilter): Promise<string[]>;
  listTables(filter: SchemaFilter): Promise<{ name: string }[]>;
  listViews(filter: SchemaFilter): Promise<{ name: string }[]>;
  listRoutines(
    filter: SchemaFilter,
  ): Promise<
    {
      schema?: string;
      routineName: string;
      routineType: string;
    }[]
  >;
  listTableColumns(
    table: string,
    schema?: string,
  ): Promise<
    {
      columnName: string;
      dataType: string;
    }[]
  >;
  listTableTriggers(table: string, schema?: string): Promise<string[]>;
  listTableIndexes(table: string, schema?: string): Promise<string[]>;
  getTableReferences(table: string, schema?: string): Promise<string[]>;
  getTableKeys(
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
  query(
    queryText: string,
  ): Promise<{
    execute: () => Promise<QueryRowResult[]>;
    cancel: () => void;
  }>;
  executeQuery(queryText: string): Promise<QueryRowResult[]>;
  getQuerySelectTop(table: string, schema?: string, limit?: number): Promise<string>;
  getTableCreateScript(table: string, schema?: string): Promise<string[]>;
  getTableSelectScript(table: string, schema?: string): Promise<string>;
  getTableInsertScript(table: string, schema?: string): Promise<string>;
  getTableUpdateScript(table: string, schema?: string): Promise<string>;
  getTableDeleteScript(table: string, schema?: string): Promise<string>;
  getViewCreateScript(view: string, schema?: string): Promise<string[]>;
  getRoutineCreateScript(routine: string, type: string, schema?: string): Promise<string[]>;
  truncateAllTables(schema?: string): Promise<void>;
  getTableColumnNames(table: string, schema?: string): Promise<string[]>;
  resolveSchema(schema?: string): Promise<string>;
  wrap(identifier: string): Promise<string>;
}

export interface SqlectronServers {
  getAll(): Promise<Array<Server>>;
  add(server: Server, cryptoSecret: string): Promise<Server>;
  update(server: Server, cryptoSecret: string): Promise<Server>;
  addOrUpdate(server: Server, cryptoSecret: string): Promise<Server>;
  removeById(id: string): Promise<void>;
  decryptSecrects(server: Server, cryptoSecret: string): Promise<Server>;
}

export interface SqlectronAPI {
  db: SqlectronDB;
  servers: SqlectronServers;
  config: SqlectronConfig;
  logger: SqlectronLogger;
}
