import { Server } from './server';

export interface Adapter {
  key: string;
  name: string;
  // adapter: typeof AbstractAdapter,
  defaultPort?: number;
  defaultDatabase?: string;
  disabledFeatures: string[];
}

export interface DatabaseFilter {
  database?:
    | string
    | {
        only?: string[];
        ignore?: string[];
      };
}

export interface SchemaFilter {
  schema?:
    | string
    | {
        only?: string[];
        ignore?: string[];
      };
}

export interface AdapterVersion {
  name: string;
  version: string;
  string: string;
}

export interface QueryArgs {
  query: string;
  params?: unknown[];
  multiple?: boolean;
}

export interface QueryRowResult {
  command: string;
  rows: unknown;
  fields: unknown;
  rowCount?: number;
  affectedRows?: number;
}

export interface ListTableResult {
  schema?: string;
  name: string;
}

export type ListViewResult = ListTableResult;

export interface ListRoutineResult {
  schema?: string;
  routineName: string;
  routineType: string;
}

export interface ListTableColumnsResult {
  columnName: string;
  dataType: string;
}
export interface TableKeysResult {
  columnName: string;
  keyType: string;
  constraintName: string | null;
  referencedTable: string | null;
}

export type QueryReturn = { execute: () => Promise<QueryRowResult[]>; cancel: () => void };

export interface AbstractAdapter {
  readonly server;
  readonly database;
  version: AdapterVersion;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  getVersion(): AdapterVersion;
  listDatabases(filter?: DatabaseFilter): Promise<string[]>;
  listSchemas(filter: SchemaFilter): Promise<string[]>;
  listTables(filter: SchemaFilter): Promise<ListTableResult[]>;
  listViews(filter: SchemaFilter): Promise<ListViewResult[]>;
  listRoutines(filter: SchemaFilter): Promise<ListRoutineResult[]>;
  listTableColumns(table: string, schema?: string): Promise<ListTableColumnsResult[]>;
  listTableTriggers(table: string, schema?: string): Promise<string[]>;
  listTableIndexes(table: string, schema?: string): Promise<string[]>;
  getTableReferences(table: string, schema?: string): Promise<string[]>;
  getTableKeys(table: string, schema?: string): Promise<TableKeysResult[]>;
  getQuerySelectTop(table: string, limit: number, schema?: string): string;
  getTableCreateScript(table: string, schema?: string): Promise<string[]>;
  getViewCreateScript(view: string, schema?: string): Promise<string[]>;
  getRoutineCreateScript(routine: string, type: string, schema?: string): Promise<string[]>;
  truncateAllTables(schema?: string): Promise<void>;
  query(queryText: string): QueryReturn;
  executeQuery(queryText: string): Promise<QueryRowResult[]>;
  wrapIdentifier(value: string): string;
}

export interface Database {
  server: Server;
  database: string | undefined;
  connecting: boolean;
  connection: null | AbstractAdapter;
  handleSSHError(): Promise<void>;
  checkIsConnected(): void;
  connect(): Promise<void>;
  disconnect(): void;
  getVersion(): AdapterVersion;
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
  ): {
    execute: () => Promise<QueryRowResult[]>;
    cancel: () => void;
  };
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
  resolveSchema(schema?: string): string;
  wrap(identifier: string): string;
}
