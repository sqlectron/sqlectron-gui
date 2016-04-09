import { getCurrentDBConn } from './connections';


export const FETCH_TABLES_REQUEST = 'FETCH_TABLES_REQUEST';
export const FETCH_TABLES_SUCCESS = 'FETCH_TABLES_SUCCESS';
export const FETCH_TABLES_FAILURE = 'FETCH_TABLES_FAILURE';


export function fetchTablesIfNeeded (database) {
  return (dispatch, getState) => {
    if (shouldFetchTables(getState(), database)) {
      return dispatch(fetchTables(database));
    }
  };
}


function shouldFetchTables (state, database) {
  const tables = state.tables;
  if (!tables) return true;
  if (tables.isFetching) return false;
  if (!tables.itemsByDatabase[database]) return true;
  return tables.didInvalidate;
}


function fetchTables (database) {
  return async (dispatch, getState) => {
    dispatch({ type: FETCH_TABLES_REQUEST, database });
    try {
      const dbConn = getCurrentDBConn(getState());
      const tables = await dbConn.listTables();
      dispatch({ type: FETCH_TABLES_SUCCESS, database, tables });
    } catch (error) {
      dispatch({ type: FETCH_TABLES_FAILURE, error });
    }
  };
}
