const getDB = require('remote').require('./src/db').getDB;


import {
  EXECUTE_QUERY_REQUEST,
  EXECUTE_QUERY_SUCCESS,
  EXECUTE_QUERY_FAILURE,
  UPDATE_SQL_SUCCESS
} from './types';


export function executeQuery(sql) {
  return dispatch => {
    dispatch({ type: EXECUTE_QUERY_REQUEST });

    return getDB().then(async function (db) {
      const queryResult = await db.query(sql);
      dispatch({ type: EXECUTE_QUERY_SUCCESS, queryResult });
    }).catch(error => dispatch({ type: EXECUTE_QUERY_FAILURE, error }));
  };
}


export function updateSQL(sql) {
  return { type: UPDATE_SQL_SUCCESS, sql };
}
