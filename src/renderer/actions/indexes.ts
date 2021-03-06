import { getDBConnByName } from './connections';
import { ApplicationState, ThunkResult } from '../reducers';

export const FETCH_INDEXES_REQUEST = 'FETCH_INDEXES_REQUEST';
export const FETCH_INDEXES_SUCCESS = 'FETCH_INDEXES_SUCCESS';
export const FETCH_INDEXES_FAILURE = 'FETCH_INDEXES_FAILURE';

export function fetchTableIndexesIfNeeded(database: string, table: string): ThunkResult<void> {
  return (dispatch, getState) => {
    if (shouldFetchTableIndexes(getState(), database, table)) {
      dispatch(fetchTableIndexes(database, table));
    }
  };
}

function shouldFetchTableIndexes(
  state: ApplicationState,
  database: string,
  table: string,
): boolean {
  const indexes = state.indexes;
  if (!indexes) return true;
  if (indexes.isFetching) return false;
  if (!indexes.indexesByTable[database]) return true;
  if (!indexes.indexesByTable[database][table]) return true;
  return indexes.didInvalidate;
}

function fetchTableIndexes(database: string, table: string): ThunkResult<void> {
  return async (dispatch) => {
    dispatch({ type: FETCH_INDEXES_REQUEST, database, table });
    try {
      const dbConn = getDBConnByName(database);
      const indexes = await dbConn.listTableIndexes(table);
      dispatch({
        type: FETCH_INDEXES_SUCCESS,
        database,
        table,
        indexes,
      });
    } catch (error) {
      dispatch({ type: FETCH_INDEXES_FAILURE, error });
    }
  };
}
