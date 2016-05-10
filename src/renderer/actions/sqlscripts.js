import { getDBConnByName } from './connections';
import { updateQueryIfNeeded } from './queries';


export const GET_SCRIPT_REQUEST = 'GET_SCRIPT_REQUEST';
export const GET_SCRIPT_SUCCESS = 'GET_SCRIPT_SUCCESS';
export const GET_SCRIPT_FAILURE = 'GET_SCRIPT_FAILURE';


export function getTableCreateScriptIfNeeded (database, table) {
  const scriptType = 'CREATE';
  return (dispatch, getState) => {
    if (shouldFetchScript(getState(), database, table, scriptType)) {
      return dispatch(getTableCreateScript(database, table, scriptType));
    }
  };
}

export function getTableSelectScriptIfNeeded (database, table) {
  const scriptType = 'SELECT';
  return (dispatch, getState) => {
    if (shouldFetchScript(getState(), database, table, scriptType)) {
      return dispatch(getTableSelectScript(database, table, scriptType));
    }
  };
}

export function getTableInsertScriptIfNeeded (database, table) {
  const scriptType = 'INSERT';
  return (dispatch, getState) => {
    if (shouldFetchScript(getState(), database, table, scriptType)) {
      return dispatch(getTableInsertScript(database, table, scriptType));
    }
  };
}

export function getTableUpdateScriptIfNeeded (database, table) {
  const scriptType = 'UPDATE';
  return (dispatch, getState) => {
    if (shouldFetchScript(getState(), database, table, scriptType)) {
      return dispatch(getTableUpdateScript(database, table, scriptType));
    }
  };
}

export function getTableDeleteScriptIfNeeded (database, table) {
  const scriptType = 'DELETE';
  return (dispatch, getState) => {
    if (shouldFetchScript(getState(), database, table, scriptType)) {
      return dispatch(getTableDeleteScript(database, table, scriptType));
    }
  };
}

export function getViewCreateScriptIfNeeded (database, view) {
  const scriptType = 'CREATE';
  return (dispatch, getState) => {
    if (shouldFetchScript(getState(), database, view, scriptType)) {
      return dispatch(getViewCreateScript(database, view, scriptType));
    }
  };
}

function shouldFetchScript (state, database, table, scriptType) {
  const scripts = state.sqlscripts;
  if (!scripts) return true;
  if (scripts.isFetching) return false;
  if (!scripts.scriptsByObject[database]) return true;
  if (!scripts.scriptsByObject[database][table]) return true;
  if (!scripts.scriptsByObject[database][table][scriptType]) return true;
  return scripts.didInvalidate;
}


function getTableCreateScript (database, table, scriptType) {
  return async (dispatch) => {
    dispatch({ type: GET_SCRIPT_REQUEST, database, table, scriptType });
    try {
      const dbConn = getDBConnByName(database);
      const [script] = await dbConn.getTableCreateScript(table);
      dispatch({ type: GET_SCRIPT_SUCCESS, database, table, script, scriptType });
      dispatch(updateQueryIfNeeded(script));
    } catch (error) {
      dispatch({ type: GET_SCRIPT_FAILURE, error });
    }
  };
}

function getTableSelectScript (database, table, scriptType) {
  return async (dispatch) => {
    dispatch({ type: GET_SCRIPT_REQUEST, database, table, scriptType });
    try {
      const dbConn = getDBConnByName(database);
      const script = await dbConn.getTableSelectScript(table);
      dispatch({ type: GET_SCRIPT_SUCCESS, database, table, script, scriptType });
      dispatch(updateQueryIfNeeded(script));
    } catch (error) {
      dispatch({ type: GET_SCRIPT_FAILURE, error });
    }
  };
}

function getTableInsertScript (database, table, scriptType) {
  return async (dispatch) => {
    dispatch({ type: GET_SCRIPT_REQUEST, database, table, scriptType });
    try {
      const dbConn = getDBConnByName(database);
      const script = await dbConn.getTableInsertScript(table);
      dispatch({ type: GET_SCRIPT_SUCCESS, database, table, script, scriptType });
      dispatch(updateQueryIfNeeded(script));
    } catch (error) {
      dispatch({ type: GET_SCRIPT_FAILURE, error });
    }
  };
}

function getTableUpdateScript (database, table, scriptType) {
  return async (dispatch) => {
    dispatch({ type: GET_SCRIPT_REQUEST, database, table, scriptType });
    try {
      const dbConn = getDBConnByName(database);
      const script = await dbConn.getTableUpdateScript(table);
      dispatch({ type: GET_SCRIPT_SUCCESS, database, table, script, scriptType });
      dispatch(updateQueryIfNeeded(script));
    } catch (error) {
      dispatch({ type: GET_SCRIPT_FAILURE, error });
    }
  };
}

function getTableDeleteScript (database, table, scriptType) {
  return async (dispatch) => {
    dispatch({ type: GET_SCRIPT_REQUEST, database, table, scriptType });
    try {
      const dbConn = getDBConnByName(database);
      const script = await dbConn.getTableDeleteScript(table);
      dispatch({ type: GET_SCRIPT_SUCCESS, database, table, script, scriptType });
      dispatch(updateQueryIfNeeded(script));
    } catch (error) {
      dispatch({ type: GET_SCRIPT_FAILURE, error });
    }
  };
}

function getViewCreateScript (database, table, scriptType) {
  return async (dispatch) => {
    dispatch({ type: GET_SCRIPT_REQUEST, database, table, scriptType });
    try {
      const dbConn = getDBConnByName(database);
      const [script] = await dbConn.getViewCreateScript(table);
      dispatch({ type: GET_SCRIPT_SUCCESS, database, table, script, scriptType });
      dispatch(updateQueryIfNeeded(script));
    } catch (error) {
      dispatch({ type: GET_SCRIPT_FAILURE, error });
    }
  };
}
