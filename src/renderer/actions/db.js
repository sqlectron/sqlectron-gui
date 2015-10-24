import { services } from '../../browser/remote';

export const DB_CONNECT_REQUEST = 'DB_CONNECT_REQUEST';
export const DB_CONNECT_SUCCESS = 'DB_CONNECT_SUCCESS';
export const DB_CONNECT_FAILURE = 'DB_CONNECT_FAILURE';

export const DB_FETCH_TABLES_REQUEST = 'DB_FETCH_TABLES_REQUEST';
export const DB_FETCH_TABLES_SUCCESS = 'DB_FETCH_TABLES_SUCCESS';
export const DB_FETCH_TABLES_FAILURE = 'DB_FETCH_TABLES_FAILURE';

export const DB_EXECUTE_QUERY_REQUEST = 'DB_EXECUTE_QUERY_REQUEST';
export const DB_EXECUTE_QUERY_SUCCESS = 'DB_EXECUTE_QUERY_SUCCESS';
export const DB_EXECUTE_QUERY_FAILURE = 'DB_EXECUTE_QUERY_FAILURE';

export const DB_FETCH_DATABASES_REQUEST = 'DB_FETCH_DATABASES_REQUEST';
export const DB_FETCH_DATABASES_SUCCESS = 'DB_FETCH_DATABASES_SUCCESS';
export const DB_FETCH_DATABASES_FAILURE = 'DB_FETCH_DATABASES_FAILURE';


export function connect (serverId, database) {
  return async (dispatch, getState) => {
    const { servers } = getState();
    const id = parseInt(serverId, 10);
    const server = {
      ...servers.items[id],
      id,
    };

    console.info('actions:db:connect', server, database);
    dispatch({ type: DB_CONNECT_REQUEST, server, database });
    try {
      await services.db.connect(server, database);
      console.info('actions:db:connected');
      dispatch({ type: DB_CONNECT_SUCCESS, server, database });
    } catch (error) {
      console.info('actions:db:error', error);
      dispatch({ type: DB_CONNECT_FAILURE, server, database, error });
    }
  };
}


export function executeQueryIfNeeded (query) {
  return (dispatch, getState) => {
    if (shouldExecuteQuery(query, getState())) {
      return dispatch(executeQuery(query));
    }
  };
}


export function fetchTablesIfNeeded (databse) {
  return (dispatch, getState) => {
    if (shouldFetchTables(getState())) {
      return dispatch(fetchTables(databse));
    }
  };
}


export function fetchDatabasesIfNeeded () {
  return (dispatch, getState) => {
    if (shouldFetchDatabases(getState())) {
      return dispatch(fetchDatabases());
    }
  };
}


function shouldFetchTables (state) {
  const tables = state.tables;
  if (!tables) return true;
  if (tables.isFetching) return false;
  return tables.didInvalidate;
}


function fetchTables (database) {
  return async dispatch => {
    dispatch({ type: DB_FETCH_TABLES_REQUEST, database });
    try {
      const tables = await services.db.listTables();
      dispatch({ type: DB_FETCH_TABLES_SUCCESS, database, tables });
    } catch (error) {
      dispatch({ type: DB_FETCH_TABLES_FAILURE, error });
    }
  };
}


function shouldExecuteQuery (query, state) {
  if (!state.query) return true;
  if (state.query.isExecuting) return false;
  if (state.query.query !== query) return true;
  return state.query.didInvalidate;
}


function executeQuery (query) {
  return async dispatch => {
    dispatch({ type: DB_EXECUTE_QUERY_REQUEST, query });
    try {
      const result = await services.db.executeQuery(query);
      dispatch({ type: DB_EXECUTE_QUERY_SUCCESS, query, result });
    } catch (error) {
      dispatch({ type: DB_EXECUTE_QUERY_FAILURE, query, error });
    }
  };
}


function shouldFetchDatabases (state) {
  const databases = state.databases;
  if (!databases) return true;
  if (databases.isFetching) return false;
  return databases.didInvalidate;
}


function fetchDatabases () {
  return async dispatch => {
    dispatch({ type: DB_FETCH_DATABASES_REQUEST });
    try {
      const databases = await services.db.listDatabases();
      dispatch({ type: DB_FETCH_DATABASES_SUCCESS, databases });
    } catch (error) {
      dispatch({ type: DB_FETCH_DATABASES_FAILURE, error });
    }
  };
}
