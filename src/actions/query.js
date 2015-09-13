import { EXECUTE_QUERY, FAIL_QUERY } from '../constants/action-types';
const getDB = require('remote').require('./src/db').getDB;


export function query(sql) {
  return dispatch => {
    return getDB().then(async function (db) {
      try {
        const queryResult = await db.query(sql);
        dispatch({ type: EXECUTE_QUERY, queryResult });
      } catch (error) {
        dispatch({ type: FAIL_QUERY, error });
      }
    });
  };
}
