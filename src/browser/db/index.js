const getDBSession = require('remote').require('./db/sqlectron-db').getDBSession;


/**
 * Exposes sqlectron-db module from main process to render process
 */
export default {
  getDBSession
};
