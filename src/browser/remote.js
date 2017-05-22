import { remote } from 'electron'; // eslint-disable-line import/no-unresolved


/**
 * Exposes to the renderer process any used API running on main process
 */
export const sqlectron = remote.require('sqlectron-core');
export const createLogger = remote.require('./logger').default;
export const config = remote.require('./config');
