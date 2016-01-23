import * as types from '../actions/connections';
import * as serverTypes from '../actions/servers';


const INITIAL_STATE = {};


export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
  case types.CONNECTION_REQUEST: {
    const { server, database } = action;
    return { connected: false, connecting: true, server, database };
  }
  case types.CONNECTION_SUCCESS: {
    if (!_isSameConnection(state, action)) return state;
    return { ...state, connected: true, connecting: false };
  }
  case types.CONNECTION_FAILURE: {
    if (!_isSameConnection(state, action)) return state;
    return { ...state, connected: false, connecting: false, error: action.error };
  }
  case types.TEST_CONNECTION_REQUEST: {
    const { server } = action;
    return { testConnected: false, testConnecting: true, testServer: server };
  }
  case types.TEST_CONNECTION_SUCCESS: {
    if (!_isSameTestConnection(state, action)) return state;
    return { ...state, testConnected: true, testConnecting: false };
  }
  case types.TEST_CONNECTION_FAILURE: {
    if (!_isSameTestConnection(state, action)) return state;
    return { ...state, testConnected: false, testConnecting: false, testError: action.error };
  }
  case serverTypes.START_EDITING_SERVER:
  case serverTypes.FINISH_EDITING_SERVER: {
    return INITIAL_STATE;
  }

  default : return state;
  }
}


function _isSameConnection (state, action) {
  return state.server === action.server
    && state.database === action.database;
}


function _isSameTestConnection (state, action) {
  return state.testServer === action.server;
}
