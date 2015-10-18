import {
  LOAD_SERVERS_SUCCESS,
  SAVE_SERVER_SUCCESS,
  SAVE_SERVER_FAILURE,
} from '../actions/types';


const INITIAL_STATE = {
  items: []
};


export default function servers(state = INITIAL_STATE, action) {
  switch (action.type) {
  case LOAD_SERVERS_SUCCESS:
    return {
      ...state,
      items: action.servers
    };
  case SAVE_SERVER_SUCCESS: {
    const servers = state.items || [];
    if (action.id !== null) {
      servers[action.id] = action.server;
    } else {
      servers.push(action.server)
    }
    return { ...state, items: servers, error: null };
  }
  case SAVE_SERVER_FAILURE: {
    return { ...state, error: action.error.validationErrors };
  }
  default:
    return state;
  }
}
