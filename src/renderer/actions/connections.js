import { sqlectron } from '../../browser/remote';


export const CLOSE_CONNECTION = 'CLOSE_CONNECTION';
export const CONNECTION_REQUEST = 'CONNECTION_REQUEST';
export const CONNECTION_SUCCESS = 'CONNECTION_SUCCESS';
export const CONNECTION_FAILURE = 'CONNECTION_FAILURE';
export const TEST_CONNECTION_REQUEST = 'TEST_CONNECTION_REQUEST';
export const TEST_CONNECTION_SUCCESS = 'TEST_CONNECTION_SUCCESS';
export const TEST_CONNECTION_FAILURE = 'TEST_CONNECTION_FAILURE';


let serverSession;
export function getCurrentDBConn ({ queries } = {}) {
  if (!serverSession) {
    throw new Error('There is no server available');
  }

  const currentQuery = queries.queriesById[queries.currentQueryId];
  if (!currentQuery) {
    return null;
  }

  const dbConn = serverSession.db(currentQuery.database);
  if (!dbConn) {
    throw new Error('This database is not available');
  }

  return dbConn;
}


export function connect (id, database, reconnecting = false) {
  return async (dispatch, getState) => {
    const state = getState();
    const serverConfig = state.servers.items.find(srv => srv.id === id);

    dispatch({ type: CONNECTION_REQUEST, server: serverConfig, database, reconnecting });
    let dbConn;
    try {
      if (!serverSession) {
        serverSession = sqlectron.db.createServer(serverConfig);
      }

      dbConn = serverSession.db(database);
      if (dbConn) {
        dispatch({ type: CONNECTION_SUCCESS, server: serverConfig, database, config, reconnecting });
        return;
      }

      dbConn = serverSession.createConnection(database);
      const [, config ] = await Promise.all([
        dbConn.connect(),
        sqlectron.config.get(),
      ]);

      dispatch({ type: CONNECTION_SUCCESS, server: serverConfig, database, config, reconnecting });
    } catch (error) {
      dispatch({ type: CONNECTION_FAILURE, server: serverConfig, database, error });
      if (dbConn) {
        dbConn.disconnect();
      }
    }
  };
}


export function disconnect () {
  serverSession.end();
  serverSession = null;
  return { type: CLOSE_CONNECTION };
}


export function reconnect (id, database) {
  serverSession.end();
  serverSession = null;
  return connect(id, database, true);
}


export function test (server) {
  return async (dispatch) => {
    const testServerSession = sqlectron.db.createServer();
    const dbClient = testServerSession.db[server.database];
    dispatch({ type: TEST_CONNECTION_REQUEST, server });
    try {
      await dbClient.connect(server, server.database);
      dispatch({ type: TEST_CONNECTION_SUCCESS, server });
    } catch (error) {
      dispatch({ type: TEST_CONNECTION_FAILURE, server, error });
    } finally {
      testServerSession.disconnect();
    }
  };
}
