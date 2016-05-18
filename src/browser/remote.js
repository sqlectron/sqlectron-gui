import { remote } from 'electron';


/**
 * Exposes to the renderer process any used API running on main process
 */
export default {
  sqlectron: remote.require('sqlectron-core'),
};
