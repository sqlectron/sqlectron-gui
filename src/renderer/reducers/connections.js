import * as types from '../actions/connections';


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
  default : return state;
  }
}


function _isSameConnection (state, action) {
  return state.server === action.server
    && state.database === action.database;
}
