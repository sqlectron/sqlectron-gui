import { SqlectronAPI } from '../shared/types/api';

declare global {
  interface Window {
    sqlectron: SqlectronAPI;
  }
}

export default window.sqlectron;
