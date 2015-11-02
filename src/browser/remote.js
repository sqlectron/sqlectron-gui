import remote from 'remote';


const sqlectron = remote.require('sqlectron-core');


/**
 * Exposes to the renderer process some API running on main process
 */
export default {
  services: {
    servers: sqlectron.servers,
    db: sqlectron.db,
  },
};
