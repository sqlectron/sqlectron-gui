import { sqlectron } from '../../browser/remote';


export const CLOSE_CONNECTION = 'CLOSE_CONNECTION';
export const CONNECTION_REQUEST = 'CONNECTION_REQUEST';
export const CONNECTION_SUCCESS = 'CONNECTION_SUCCESS';
export const CONNECTION_FAILURE = 'CONNECTION_FAILURE';
export const CONNECTION_REQUIRE_SSH_PASSPHRASE = 'CONNECTION_REQUIRE_SSH_PASSPHRASE';
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

  return getDBConnByName(currentQuery.database);
}


export function getDBConnByName(database) {
  if (!serverSession) {
    throw new Error('There is no server available');
  }

  const dbConn = serverSession.db(database);
  if (!dbConn) {
    throw new Error('This database is not available');
  }

  return dbConn;
}


export function connect (id, databaseName, reconnecting = false, sshPassphrase) {
  return async (dispatch, getState) => {
    let server;
    let dbConn;
    let database;
    let defaultDatabase;

    try {
      const { config } = getState();
      const cryptoSecret = config.data.crypto.secret;

      const servers = await sqlectron.servers.getAll();
      server = servers.find(srv => srv.id === id);
      if (!server) {
        throw new Error('Server configuration not found');
      }

      server = sqlectron.servers.decryptSecrects(server, cryptoSecret);

      // Terrible workaround to avoid a state issue of data loading from the main process.
      // For some reason changing a value here in client from a data coming from the main process
      // doesn't have any effect. We need to clone this data and use the new state.
      server = JSON.parse(JSON.stringify(server));

      defaultDatabase = sqlectron.db.CLIENTS.find(c => c.key === server.client).defaultDatabase;
      database = databaseName || server.database || defaultDatabase;

      dispatch({
        type: CONNECTION_REQUEST,
        server,
        database,
        reconnecting,
        isServerConnection: !databaseName,
      });

      if (!serverSession) {
        if (server.ssh) {
          if (server.ssh.privateKeyWithPassphrase && typeof sshPassphrase === 'undefined') {
            dispatch({ type: CONNECTION_REQUIRE_SSH_PASSPHRASE });
            return;
          }

          if (server.ssh.privateKeyWithPassphrase) {
            server.ssh.passphrase = sshPassphrase;
          }
        }
        serverSession = sqlectron.db.createServer(server);
      }

      dbConn = serverSession.db(database);
      if (dbConn) {
        dispatch({ type: CONNECTION_SUCCESS, server, database, config, reconnecting });
        return;
      }

      dbConn = serverSession.createConnection(database);
      await dbConn.connect();

      dispatch({ type: CONNECTION_SUCCESS, server, database, config, reconnecting });
    } catch (error) {
      dispatch({ type: CONNECTION_FAILURE, server, database, error });
      if (dbConn) {
        dbConn.disconnect();
      }
      const currentConn = getState().connections;
      if (!currentConn.databases.length) {
        this.disconnect();
      }
    }
  };
}


export function disconnect () {
  if (serverSession) {
    serverSession.end();
  }

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
    dispatch({ type: TEST_CONNECTION_REQUEST, server });
    let dbClient;
    try {
      const testServerSession = sqlectron.db.createServer(server);
      dbClient = testServerSession.createConnection(server.database);

      await dbClient.connect(server, server.database);
      dispatch({ type: TEST_CONNECTION_SUCCESS, server });
    } catch (error) {
      dispatch({ type: TEST_CONNECTION_FAILURE, server, error });
    } finally {
      if (dbClient) {
        dbClient.disconnect();
      }
    }
  };
}
