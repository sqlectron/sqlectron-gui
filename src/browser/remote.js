import remote from 'remote';


/**
 * Exposes to the renderer process any used API running on main process
 */
export const sqlectron = remote.require('sqlectron-core');
