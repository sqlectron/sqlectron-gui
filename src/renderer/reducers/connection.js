import * as types from '../actions/db';


export default function(state = {}, action) {
  switch (action.type) {
  case types.DB_CONNECT_REQUEST: {
    const { server, database } = action;
    return { connected: false, connecting: true, server, database };
  }
  case types.DB_CONNECT_SUCCESS: {
    if (!_isSameConnection(state, action)) return state;
    return { ...state, connected: true, connecting: false };
  }
  case types.DB_CONNECT_FAILURE: {
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
