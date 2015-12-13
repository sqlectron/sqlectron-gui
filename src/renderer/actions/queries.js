import { sqlectron } from '../../browser/remote';


export const EXECUTE_QUERY_REQUEST = 'EXECUTE_QUERY_REQUEST';
export const EXECUTE_QUERY_SUCCESS = 'EXECUTE_QUERY_SUCCESS';
export const EXECUTE_QUERY_FAILURE = 'EXECUTE_QUERY_FAILURE';
export const UPDATE_QUERY = 'UPDATE_QUERY';


export function executeQueryIfNeeded (query) {
  return (dispatch, getState) => {
    if (shouldExecuteQuery(query, getState())) {
      return dispatch(executeQuery(query));
    }
  };
}


export function executeDefaultSelectQueryIfNeeded (table) {
  return async (dispatch, getState) => {
    const query = await sqlectron.db.getQuerySelectTop(table);
    if (shouldExecuteQuery(query, getState())) {
      return dispatch(executeQuery(query, true));
    }
  };
}


export function updateQuery (query) {
  return { type: UPDATE_QUERY, query };
}


function shouldExecuteQuery (query, state) {
  const { queries } = state;
  if (!queries) return true;
  if (queries.isExecuting) return false;
  const previousQuery = queries.queryHistory[queries.queryHistory.length - 1];
  if (previousQuery !== query) return true;
  return state.queries.didInvalidate;
}


function executeQuery (query, isDefaultSelect = false) {
  return async dispatch => {
    dispatch({ type: EXECUTE_QUERY_REQUEST, query, isDefaultSelect });
    try {
      const result = await sqlectron.db.executeQuery(query);
      dispatch({ type: EXECUTE_QUERY_SUCCESS, query, result });
    } catch (error) {
      dispatch({ type: EXECUTE_QUERY_FAILURE, query, error });
    }
  };
}
