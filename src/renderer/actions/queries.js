import { services } from '../../browser/remote';


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
  return (dispatch, getState) => {
    const query = services.db.getQuerySelectTop(table);
    if (shouldExecuteQuery(query, getState())) {
      return dispatch(executeQuery(query));
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


function executeQuery (query) {
  return async dispatch => {
    dispatch({ type: EXECUTE_QUERY_REQUEST, query });
    try {
      const result = await services.db.executeQuery(query);
      dispatch({ type: EXECUTE_QUERY_SUCCESS, query, result });
    } catch (error) {
      dispatch({ type: EXECUTE_QUERY_FAILURE, query, error });
    }
  };
}
