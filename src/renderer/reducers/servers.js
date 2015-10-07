import { LOAD_SERVERS_SUCCESS, OPEN_ADD_SERVERS } from '../actions/types';


const INITIAL_STATE = {
  creatingOrEditing: false,
  servers: []
};


export default function servers(state = INITIAL_STATE, action) {
  switch (action.type) {
  case LOAD_SERVERS_SUCCESS:
    return {
      ...state,
      servers: action.servers
    };
  case OPEN_ADD_SERVERS:
    return {
      ...state,
      creatingOrEditing: true
    };
  default:
    return state;
  }
}
