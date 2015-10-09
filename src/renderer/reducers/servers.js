import {
  LOAD_SERVERS_SUCCESS,
  SAVE_SERVER_SUCCESS,
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
    if (action.id) {
      servers[action.id] = action.server;
    } else {
      servers.push(action.server)
    }
    return { ...state, items: servers };
  }
  default:
    return state;
  }
}
