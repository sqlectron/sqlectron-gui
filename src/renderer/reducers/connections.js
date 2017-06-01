import * as types from '../actions/connections';
import * as serverTypes from '../actions/servers';
import { sqlectron } from '../../browser/remote';

const CLIENTS = sqlectron.db.CLIENTS;

const INITIAL_STATE = {
  connected: false,
  connecting: false,
  server: null,
  disabledFeatures: null,
  waitingPrivateKeyPassphrase: false,
  databases: [], // connected databases
};


export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.CONNECTION_REQUEST: {
      const { disabledFeatures } = CLIENTS.find(dbClient => dbClient.key === action.server.client);
      return {
        ...INITIAL_STATE,
        server: action.server,
        disabledFeatures: disabledFeatures || [],
      };
    }
    case types.CONNECTION_REQUIRE_SSH_PASSPHRASE: {
      return { ...state, waitingPrivateKeyPassphrase: true };
    }
    case types.CONNECTION_SUCCESS: {
      return {
        ...state,
        connected: true,
        connecting: false,
        waitingPrivateKeyPassphrase: false,
        databases: [
          ...state.databases,
          action.database,
        ],
      };
    }
    case types.CONNECTION_FAILURE: {
      return {
        ...state,
        connected: false,
        connecting: false,
        waitingPrivateKeyPassphrase: false,
        error: action.error,
      };
    }
    case types.TEST_CONNECTION_REQUEST: {
      const { server } = action;
      return { testConnected: false, testConnecting: true, testServer: server };
    }
    case types.TEST_CONNECTION_SUCCESS: {
      if (!isSameTestConnection(state, action)) return state;
      return { ...state, testConnected: true, testConnecting: false };
    }
    case types.TEST_CONNECTION_FAILURE: {
      if (!isSameTestConnection(state, action)) return state;
      return { ...state, testConnected: false, testConnecting: false, testError: action.error };
    }
    case types.CLOSE_CONNECTION:
    case serverTypes.START_EDITING_SERVER:
    case serverTypes.FINISH_EDITING_SERVER: {
      return INITIAL_STATE;
    }

    default : return state;
  }
}


function isSameTestConnection (state, action) {
  return state.testServer === action.server;
}
