import { getCurrentDBConn } from './connections';
import { ApplicationState, ThunkResult } from '../reducers';

export const FETCH_SCHEMAS_REQUEST = 'FETCH_SCHEMAS_REQUEST';
export const FETCH_SCHEMAS_SUCCESS = 'FETCH_SCHEMAS_SUCCESS';
export const FETCH_SCHEMAS_FAILURE = 'FETCH_SCHEMAS_FAILURE';

export function fetchSchemasIfNeeded(database: string): ThunkResult<void> {
  return (dispatch, getState) => {
    if (shouldFetchSchemas(getState(), database)) {
      dispatch(fetchSchemas(database));
    }
  };
}

function shouldFetchSchemas(state: ApplicationState, database: string): boolean {
  const schemas = state.schemas;
  if (!schemas) return true;
  if (schemas.isFetching) return false;
  if (!schemas.itemsByDatabase[database]) return true;
  return schemas.didInvalidate;
}

function fetchSchemas(database: string): ThunkResult<void> {
  return async (dispatch, getState) => {
    dispatch({ type: FETCH_SCHEMAS_REQUEST, database });
    try {
      const dbConn = getCurrentDBConn(getState());
      // TODO: pass real filter setting
      const schemas = await dbConn?.listSchemas({});
      dispatch({ type: FETCH_SCHEMAS_SUCCESS, database, schemas });
    } catch (error) {
      dispatch({ type: FETCH_SCHEMAS_FAILURE, error });
    }
  };
}
