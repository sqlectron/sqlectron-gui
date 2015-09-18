const getDB = require('remote').require('./src/db').getDB;


import {
  LOAD_DATABASES_REQUEST,
  LOAD_DATABASES_SUCCESS,
  LOAD_DATABASES_FAILURE
} from '../constants/action-types';


export function loadDatabases() {
  return dispatch => {
    dispatch({ type: LOAD_DATABASES_REQUEST });

    return getDB().then(async function (db) {
      const databases = (await db.databaseList()).map(name => {
        return { name, tables: [] };
      });

      // TODO: get default db from connection configuration
      // for while considers the first db the defualt db
      databases[0].tables = await db.tableList();

      dispatch({ type: LOAD_DATABASES_SUCCESS, databases });
    }).catch(error => dispatch({ type: LOAD_DATABASES_FAILURE, error }));
  };
}
