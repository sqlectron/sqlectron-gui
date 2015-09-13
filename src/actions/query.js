import { EXECUTE_QUERY } from '../constants/action-types';
const getDB = require('remote').require('./src/db').getDB;


export function query(sql) {
  return dispatch => {
    return getDB().then(async function (db) {
      const queryResult = await db.query(sql);

      dispatch({ type: EXECUTE_QUERY, queryResult });
    });
  };
}
