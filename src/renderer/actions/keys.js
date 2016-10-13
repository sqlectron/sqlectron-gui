import { getDBConnByName } from './connections';


export const FETCH_KEYS_REQUEST = 'FETCH_KEYS_REQUEST';
export const FETCH_KEYS_SUCCESS = 'FETCH_KEYS_SUCCESS';
export const FETCH_KEYS_FAILURE = 'FETCH_KEYS_FAILURE';


export function fetchTableKeysIfNeeded (database, table, schema) {
  return (dispatch, getState) => {
    if (shouldFetchTableKeys(getState(), database, table)) {
      dispatch(fetchTableKeys(database, table, schema));
    }
  };
}


function shouldFetchTableKeys (state, database, table) {
  const keys = state.keys;
  if (!keys) return true;
  if (keys.isFetching[database] && keys.isFetching[database][table]) return false;
  if (!keys.keysByTable[database]) return true;
  if (!keys.keysByTable[database][table]) return true;
  return keys.didInvalidate;
}


function fetchTableKeys (database, table, schema) {
  return async dispatch => {
    dispatch({ type: FETCH_KEYS_REQUEST, database, table });
    try {
      const dbConn = getDBConnByName(database);
      const tableKeys = await dbConn.getTableKeys(table, schema);
      dispatch({ type: FETCH_KEYS_SUCCESS, database, table, tableKeys });
    } catch (error) {
      dispatch({ type: FETCH_KEYS_FAILURE, error });
    }
  };
}
