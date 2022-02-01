import type { Adapter as SqlectronAdapter } from 'sqlectron-db-core';

export type { Database, SchemaFilter, DatabaseFilter } from 'sqlectron-db-core';

export type Adapter = Omit<SqlectronAdapter, 'adapter'>;
