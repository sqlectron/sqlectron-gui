import { getDBConnByName } from './connections';


export const FETCH_COLUMNS_REQUEST = 'FETCH_COLUMNS_REQUEST';
export const FETCH_COLUMNS_SUCCESS = 'FETCH_COLUMNS_SUCCESS';
export const FETCH_COLUMNS_FAILURE = 'FETCH_COLUMNS_FAILURE';


export function fetchTableColumns (database, table) {
  return (dispatch, getState) => {
    if (_shouldFetchTableColumns(getState(), database, table)) {
      return dispatch(_fetchTableColumns(database, table));
    }
  };
}


function _shouldFetchTableColumns (state, database, table) {
  const columns = state.columns;
  if (!columns) return true;
  if (columns.isFetching) return false;
  if (!columns.columnsByTable[database]) return true;
  if (!columns.columnsByTable[database][table]) return true;
  return columns.didInvalidate;
}


function _fetchTableColumns (database, table) {
  return async (dispatch, getState) => {
    dispatch({ type: FETCH_COLUMNS_REQUEST, database, table });
    try {
      const dbConn = getDBConnByName(database);
      const columns = await dbConn.listTableColumns(table);
      dispatch({ type: FETCH_COLUMNS_SUCCESS, database, table, columns });
    } catch (error) {
      dispatch({ type: FETCH_COLUMNS_FAILURE, error });
    }
  };
}
