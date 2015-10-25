const remote = require('remote');
const servers = remote.require('./services/servers');
const db = remote.require('./services/db');


/**
 * Exposes to the renderer process some API running on main process
 */
export default {
  services: {
    servers,
    db,
  },
};
