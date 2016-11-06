import { getDBConnByName } from './connections';


export const FETCH_INDEXES_REQUEST = 'FETCH_INDEXES_REQUEST';
export const FETCH_INDEXES_SUCCESS = 'FETCH_INDEXES_SUCCESS';
export const FETCH_INDEXES_FAILURE = 'FETCH_INDEXES_FAILURE';


export function fetchTableIndexesIfNeeded (database, table) {
  return (dispatch, getState) => {
    if (shouldFetchTableIndexes(getState(), database, table)) {
      dispatch(fetchTableIndexes(database, table));
    }
  };
}


function shouldFetchTableIndexes (state, database, table) {
  const indexes = state.indexes;
  if (!indexes) return true;
  if (indexes.isFetching) return false;
  if (!indexes.indexesByTable[database]) return true;
  if (!indexes.indexesByTable[database][table]) return true;
  return indexes.didInvalidate;
}


function fetchTableIndexes (database, table) {
  return async dispatch => {
    dispatch({ type: FETCH_INDEXES_REQUEST, database, table });
    try {
      const dbConn = getDBConnByName(database);
      const indexes = await dbConn.listTableIndexes(table);
      dispatch({ type: FETCH_INDEXES_SUCCESS, database, table, indexes });
    } catch (error) {
      dispatch({ type: FETCH_INDEXES_FAILURE, error });
    }
  };
}
