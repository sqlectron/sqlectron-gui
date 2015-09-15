import { LODAD_DABATASES } from '../constants/action-types';
const getDB = require('remote').require('./src/db').getDB;


export function loadDatabases() {
  return dispatch => {
    return getDB().then(async function (db) {
      const databases = (await db.databaseList()).map(name => {
        return { name, tables: [] };
      });

      // TODO: get default db from connection configuration
      // for while considers the first db the defualt db
      databases[0].tables = await db.tableList();
      
      dispatch({ type: LODAD_DABATASES, databases });
    });
  };
}

export function dropDatabase(database) {
  return loadDatabases();
}
