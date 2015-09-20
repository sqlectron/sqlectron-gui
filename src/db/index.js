const getDBSession = require('remote').require('./src/db/sqlectron-db').getDBSession;


/**
 * Exposes sqlectron-db module from main process to render process
 */
export default {
  getDBSession
};
