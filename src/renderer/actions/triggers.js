import { getDBConnByName } from './connections';


export const FETCH_TRIGGERS_REQUEST = 'FETCH_TRIGGERS_REQUEST';
export const FETCH_TRIGGERS_SUCCESS = 'FETCH_TRIGGERS_SUCCESS';
export const FETCH_TRIGGERS_FAILURE = 'FETCH_TRIGGERS_FAILURE';


export function fetchTableTriggersIfNeeded (database, table, schema) {
  return (dispatch, getState) => {
    if (shouldFetchTableTriggers(getState(), database, table)) {
      dispatch(fetchTableTriggers(database, table, schema));
    }
  };
}


function shouldFetchTableTriggers (state, database, table) {
  const triggers = state.triggers;
  if (!triggers) return true;
  if (triggers.isFetching) return false;
  if (!triggers.triggersByTable[database]) return true;
  if (!triggers.triggersByTable[database][table]) return true;
  return triggers.didInvalidate;
}


function fetchTableTriggers (database, table, schema) {
  return async dispatch => {
    dispatch({ type: FETCH_TRIGGERS_REQUEST, database, table });
    try {
      const dbConn = getDBConnByName(database);
      const triggers = await dbConn.listTableTriggers(table, schema);
      dispatch({ type: FETCH_TRIGGERS_SUCCESS, database, table, triggers });
    } catch (error) {
      dispatch({ type: FETCH_TRIGGERS_FAILURE, error });
    }
  };
}
