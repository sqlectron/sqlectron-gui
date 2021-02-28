import { sqlectron, DB_CLIENTS } from '../api';
import { Server } from '../../common/types/server';

export const CLOSE_CONNECTION = 'CLOSE_CONNECTION';
export const CONNECTION_REQUEST = 'CONNECTION_REQUEST';
export const CONNECTION_SUCCESS = 'CONNECTION_SUCCESS';
export const CONNECTION_FAILURE = 'CONNECTION_FAILURE';
export const CONNECTION_REQUIRE_SSH_PASSPHRASE = 'CONNECTION_REQUIRE_SSH_PASSPHRASE';
export const CONNECTION_SET_CONNECTING = 'CONNECTION_SET_CONNECTING';
export const TEST_CONNECTION_REQUEST = 'TEST_CONNECTION_REQUEST';
export const TEST_CONNECTION_SUCCESS = 'TEST_CONNECTION_SUCCESS';
export const TEST_CONNECTION_FAILURE = 'TEST_CONNECTION_FAILURE';

let serverSession;
// export function getCurrentDBConn({ queries } = {}) {
//   if (!serverSession) {
//     throw new Error('There is no server available');
//   }

//   const currentQuery = queries.queriesById[queries.currentQueryId];
//   if (!currentQuery) {
//     return null;
//   }

//   return getDBConnByName(currentQuery.database);
// }

// export function getDBConnByName(database) {
//   if (!serverSession) {
//     throw new Error('There is no server available');
//   }

//   const dbConn = serverSession.db(database);
//   if (!dbConn) {
//     throw new Error('This database is not available');
//   }

//   return dbConn;
// }

export function setConnecting() {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  return (dispatch): void => {
    dispatch({ type: CONNECTION_SET_CONNECTING });
  };
}

export function connect(
  id: string,
  databaseName: string,
  reconnecting = false,
  // sshPassphrase?: string
) {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  return async (dispatch, getState) => {
    let server: Server | undefined;
    // let dbConn;
    let database;
    let defaultDatabase;

    try {
      const { config } = getState();
      const cryptoSecret = config.data.crypto.secret;

      const servers = await sqlectron.servers.getAll();
      server = servers.find((srv) => srv.id === id);
      if (!server) {
        throw new Error('Server configuration not found');
      }

      server = await sqlectron.servers.decryptSecrects(server, cryptoSecret);

      const dbClient = DB_CLIENTS.find((c) => c.key === server?.client);
      defaultDatabase = dbClient?.defaultDatabase;
      database = databaseName || server.database || defaultDatabase;

      dispatch({
        type: CONNECTION_REQUEST,
        server,
        database,
        reconnecting,
        isServerConnection: !databaseName,
      });

      // if (!serverSession) {
      //   if (server.ssh) {
      //     if (server.ssh.privateKeyWithPassphrase && typeof sshPassphrase === 'undefined') {
      //       dispatch({ type: CONNECTION_REQUIRE_SSH_PASSPHRASE });
      //       return;
      //     }

      //     if (server.ssh.privateKeyWithPassphrase) {
      //       server.ssh.passphrase = sshPassphrase;
      //     }
      //   }
      //   serverSession = sqlectron.db.createServer(server);
      // }

      // dbConn = serverSession.db(database);
      if (await sqlectron.db.checkIsConnected()) {
        dispatch({
          type: CONNECTION_SUCCESS,
          server,
          database,
          config,
          reconnecting,
        });
        return;
      }

      // dbConn = serverSession.createConnection(database);
      await sqlectron.db.connect();

      dispatch({
        type: CONNECTION_SUCCESS,
        server,
        database,
        config,
        reconnecting,
      });
    } catch (error) {
      dispatch({
        type: CONNECTION_FAILURE,
        server,
        database,
        error,
      });

      if (await sqlectron.db.checkIsConnected()) {
        sqlectron.db.disconnect();
      }

      // TODO: disconnect
      // const currentConn = getState().connections;
      // if (!currentConn.databases.length) {
      //   this.disconnect();
      // }
    }
  };
}

export function disconnect(): { type: string } {
  if (serverSession) {
    serverSession.end();
  }

  serverSession = null;

  return { type: CLOSE_CONNECTION };
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function reconnect(id, database) {
  serverSession.end();
  serverSession = null;
  return connect(id, database, true);
}

export function test(server: Server) {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  return async (dispatch) => {
    const serverCopy = JSON.parse(JSON.stringify(server));
    if (!serverCopy.database) {
      const dbClient = DB_CLIENTS.find((c) => c.key === serverCopy.client);
      const defaultDatabase = dbClient?.defaultDatabase;
      serverCopy.database = serverCopy.database || defaultDatabase;
    }
    dispatch({ type: TEST_CONNECTION_REQUEST, serverCopy });
    let dbClient;
    try {
      // TODO: Fix test connection
      // const testServerSession = sqlectron.db.createServer(serverCopy);
      // dbClient = testServerSession.createConnection(serverCopy.database);
      // await dbClient.connect(serverCopy, server.database);
      await sqlectron.db.connect(serverCopy, server.database);

      dispatch({ type: TEST_CONNECTION_SUCCESS, serverCopy });
    } catch (error) {
      dispatch({ type: TEST_CONNECTION_FAILURE, serverCopy, error });
    } finally {
      if (dbClient) {
        dbClient.disconnect();
      }
    }
  };
}
