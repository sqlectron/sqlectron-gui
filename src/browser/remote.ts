import { remote } from 'electron';

/**
 * Exposes to the renderer process any used API running on main process
 */
export const sqlectron = remote.require('./core');
export const createLogger = remote.require('./logger').default;
export const config = remote.require('./config');
