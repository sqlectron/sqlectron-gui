import {
  LOAD_SERVERS_SUCCESS,
  SAVE_SERVER_SUCCESS,
  SAVE_SERVER_FAILURE,
} from '../actions/types';


const INITIAL_STATE = {
  items: [],
};


export default function servers(state = INITIAL_STATE, action) {
  switch (action.type) {
  case LOAD_SERVERS_SUCCESS:
    return {
      ...state,
      items: action.servers,
    };
  case SAVE_SERVER_SUCCESS: {
    const items = state.items || [];
    if (action.id !== null) {
      items[action.id] = action.server;
    } else {
      items.push(action.server);
    }
    return { ...state, items, error: null };
  }
  case SAVE_SERVER_FAILURE: {
    return { ...state, error: action.error.validationErrors };
  }
  default:
    return state;
  }
}