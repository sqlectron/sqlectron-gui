import { SqlectronAPI } from '../common/types/api';

declare global {
  interface Window {
    sqlectron: SqlectronAPI;
  }
}

// Export sqlectron API with the integration for any backend core logic call
export const sqlectron = window.sqlectron;

// Load metadata configuration only once and export them as constants
export const CONFIG = sqlectron.config.getSync();
export const DB_CLIENTS = sqlectron.db.getClientsSync();
