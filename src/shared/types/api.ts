import { Tab } from './tab';

export interface SqlectronConfig {
  load: () => Promise<any>;
}

export interface SqlectronTabStore {
  loadTabs: (serverId: string, databaseName: string) => Promise<Array<Tab>>;
  createTab: (
    serverId: string,
    databaseName: string,
    type: string,
  ) => Promise<Tab>;
  loadTabContent: (tab: Tab) => Promise<string | undefined>;
  saveTabContent: (tab: Tab, content: string) => void;
  removeTab: (tab: Tab) => Promise<undefined>;
}

export interface SqlectronDB {
  onConnection: (cb: (connEvent: string, serverId: string) => void) => void;
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

export interface SqlectronAPI {
  openWorkspaceWindow: (serverId: string) => Promise<any>;
  db: SqlectronDB;
  config: SqlectronConfig;
  tabStore: SqlectronTabStore;
}
