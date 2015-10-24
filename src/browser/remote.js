const remote = require('remote');
// const getDBSession = remote.require('./db/sqlectron-db').getDBSession;
const servers = remote.require('./services/servers');
const db = remote.require('./services/db');


/**
 * Exposes to the renderer process some API running on main process
 */
export default {
  getDBSession: () => Promise.resolve({}),
  services: {
    servers,
    db,
  },
};
