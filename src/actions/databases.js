import { getDBSession } from '../db';


import {
  LOAD_DATABASES_REQUEST,
  LOAD_DATABASES_SUCCESS,
  LOAD_DATABASES_FAILURE
} from './types';


export function loadDatabases() {
  return dispatch => {
    dispatch({ type: LOAD_DATABASES_REQUEST });

    return getDBSession().then(async function (dbSession) {
      const databases = (await dbSession.databaseList()).map(name => {
        return { name, tables: [] };
      });

      // TODO: get default db from connection configuration
      // for while considers the first db the defualt db
      databases[0].tables = await dbSession.tableList();

      dispatch({ type: LOAD_DATABASES_SUCCESS, databases });
    }).catch(error => dispatch({ type: LOAD_DATABASES_FAILURE, error }));
  };
}
