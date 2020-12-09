export interface SqlectronConfig {
  load: () => Promise<any>;
}

export interface SqlectronAPI {
  openWorkspaceWindow: (serverId: string) => Promise<any>;
  db: SqlectronDB;
  config: SqlectronConfig;
}

export interface SqlectronDB {
  onConnection: (
    cb: (connEvent: string, serverId: string) => void,
  ) => Promise<any>;
  listTables: () => Promise<any>;
  listDatabases: () => Promise<any>;
  executeQuery: (query: string) => Promise<any>;
  openDatabase: (databaseName: string) => Promise<any>;
  connect: (
    id: string,
    databaseName: string,
    reconnecting: boolean,
    sshPassphrase: string,
  ) => Promise<any>;
}

declare global {
  interface Window {
    sqlectron: SqlectronAPI;
  }
}

export default window.sqlectron;
