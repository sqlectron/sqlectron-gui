export interface SqlectronAPI {
  openWorkspaceWindow: (serverId: string) => Promise<any>;
}

declare global {
  interface Window {
    sqlectron: SqlectronAPI;
  }
}

export default window.sqlectron;
