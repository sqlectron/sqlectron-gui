export interface QueryResultField {
  name: string;
  columnType: number;
}

export interface QueryResult {
  command: string;
  affectedRows: number;
  rowCount: number;
  fields: Array<QueryResultField>;
  rows: Array<Object>;
}
