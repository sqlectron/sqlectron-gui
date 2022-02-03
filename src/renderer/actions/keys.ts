import { sqlectron } from '../api';
import { ApplicationState, ThunkResult } from '../reducers';

export const FETCH_KEYS_REQUEST = 'FETCH_KEYS_REQUEST';
export const FETCH_KEYS_SUCCESS = 'FETCH_KEYS_SUCCESS';
export const FETCH_KEYS_FAILURE = 'FETCH_KEYS_FAILURE';

export function fetchTableKeysIfNeeded(
  database: string,
  table: string,
  schema?: string,
): ThunkResult<void> {
  return (dispatch, getState) => {
    if (shouldFetchTableKeys(getState(), database, table)) {
      dispatch(fetchTableKeys(database, table, schema));
    }
  };
}

function shouldFetchTableKeys(state: ApplicationState, database: string, table: string): boolean {
  const keys = state.keys;
  if (!keys) return true;
  if (keys.isFetching[database] && keys.isFetching[database][table]) return false;
  if (!keys.keysByTable[database]) return true;
  if (!keys.keysByTable[database][table]) return true;
  return keys.didInvalidate;
}

function fetchTableKeys(database: string, table: string, schema?: string): ThunkResult<void> {
  return async (dispatch) => {
    dispatch({ type: FETCH_KEYS_REQUEST, database, table });
    try {
      const tableKeys = await sqlectron.db.getTableKeys(database, table, schema);
      dispatch({
        type: FETCH_KEYS_SUCCESS,
        database,
        table,
        tableKeys,
      });
    } catch (error) {
      dispatch({ type: FETCH_KEYS_FAILURE, error });
    }
  };
}
