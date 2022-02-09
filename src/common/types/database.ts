import type { Adapter as SqlectronAdapter } from 'sqlectron-db-core';
import type { ListTableResult, ListViewResult } from 'sqlectron-db-core/adapters/abstract_adapter';

export type { Database, SchemaFilter, DatabaseFilter } from 'sqlectron-db-core';

export type Adapter = Omit<SqlectronAdapter, 'adapter'>;

export type DbTable = ListTableResult;
export type DbView = ListViewResult;
