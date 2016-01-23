import { sqlectron } from '../../browser/remote';


export const CLOSE_CONNECTION = 'CLOSE_CONNECTION';
export const CONNECTION_REQUEST = 'CONNECTION_REQUEST';
export const CONNECTION_SUCCESS = 'CONNECTION_SUCCESS';
export const CONNECTION_FAILURE = 'CONNECTION_FAILURE';
export const TEST_CONNECTION_REQUEST = 'TEST_CONNECTION_REQUEST';
export const TEST_CONNECTION_SUCCESS = 'TEST_CONNECTION_SUCCESS';
export const TEST_CONNECTION_FAILURE = 'TEST_CONNECTION_FAILURE';


export const dbSession = sqlectron.db.createSession();


export function connect (id, database) {
  return async (dispatch, getState) => {
    const { servers } = getState();
    const server = servers.items.find(srv => srv.id === id);

    dispatch({ type: CONNECTION_REQUEST, server, database });
    try {
      const [, config ] = await Promise.all([
        dbSession.connect(server, database),
        sqlectron.config.get(),
      ]);
      dispatch({ type: CONNECTION_SUCCESS, server, database, config });
    } catch (error) {
      dispatch({ type: CONNECTION_FAILURE, server, database, error });
      dbSession.disconnect();
    }
  };
}


export function disconnect () {
  dbSession.disconnect();
  return { type: CLOSE_CONNECTION };
}


export function test (server) {
  return async (dispatch) => {
    const testDBSession = sqlectron.db.createSession();
    dispatch({ type: TEST_CONNECTION_REQUEST, server });
    try {
      await testDBSession.connect(server, server.database);
      dispatch({ type: TEST_CONNECTION_SUCCESS, server });
    } catch (error) {
      dispatch({ type: TEST_CONNECTION_FAILURE, server, error });
    } finally {
      testDBSession.disconnect();
    }
  };
}
