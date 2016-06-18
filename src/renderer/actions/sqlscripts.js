import { getDBConnByName } from './connections';
import { appendQuery } from './queries';


export const GET_SCRIPT_REQUEST = 'GET_SCRIPT_REQUEST';
export const GET_SCRIPT_SUCCESS = 'GET_SCRIPT_SUCCESS';
export const GET_SCRIPT_FAILURE = 'GET_SCRIPT_FAILURE';


export function getSQLScriptIfNeeded(database, item, actionType, objectType) {
  return (dispatch, getState) => {
    const state = getState();
    if (shouldFetchScript(state, database, item, actionType)) {
      dispatch(getSQLScript(database, item, actionType, objectType));
      return;
    }

    if (isScriptAlreadyFetched(state, database, item, actionType)) {
      const script = getAlreadyFetchedScript(state, database, item, actionType);
      dispatch(appendQuery(script));
    }
  };
}

function shouldFetchScript (state, database, item, actionType) {
  const scripts = state.sqlscripts;
  if (!scripts) return true;
  if (scripts.isFetching) return false;
  if (!scripts.scriptsByObject[database]) return true;
  if (!scripts.scriptsByObject[database][item]) return true;
  if (!scripts.scriptsByObject[database][item][actionType]) return true;
  return scripts.didInvalidate;
}

function isScriptAlreadyFetched (state, database, item, actionType) {
  const scripts = state.sqlscripts;
  if (!scripts.scriptsByObject[database]) return false;
  if (!scripts.scriptsByObject[database][item]) return false;
  if (scripts.scriptsByObject[database][item][actionType]) return true;
  return false;
}

function getAlreadyFetchedScript (state, database, item, actionType) {
  return state.sqlscripts.scriptsByObject[database][item][actionType];
}


function getSQLScript (database, item, actionType, objectType) {
  return async (dispatch) => {
    dispatch({ type: GET_SCRIPT_REQUEST, database, item, actionType, objectType });
    try {
      const dbConn = getDBConnByName(database);
      let script;
      if (actionType === 'CREATE' && objectType === 'Table') {
        [script] = await dbConn.getTableCreateScript(item);
      } else if (actionType === 'CREATE' && objectType === 'View') {
        [script] = await dbConn.getViewCreateScript(item);
      } else if (actionType === 'CREATE') {
        [script] = await dbConn.getRoutineCreateScript(item, objectType);
      } else if (actionType === 'SELECT') {
        script = await dbConn.getTableSelectScript(item);
      } else if (actionType === 'INSERT') {
        script = await dbConn.getTableInsertScript(item);
      } else if (actionType === 'UPDATE') {
        script = await dbConn.getTableUpdateScript(item);
      } else if (actionType === 'DELETE') {
        script = await dbConn.getTableDeleteScript(item);
      }
      dispatch({ type: GET_SCRIPT_SUCCESS, database, item, script, actionType, objectType });
      dispatch(appendQuery(script));
    } catch (error) {
      dispatch({ type: GET_SCRIPT_FAILURE, error });
    }
  };
}
