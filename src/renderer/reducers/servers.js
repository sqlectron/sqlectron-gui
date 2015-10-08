import {
  LOAD_SERVERS_SUCCESS,
  OPEN_ADD_SERVER,
  OPEN_EDIT_SERVER,
} from '../actions/types';


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
  case OPEN_ADD_SERVER:
    return {
      ...state,
      creatingOrEditing: true
    };
  case OPEN_EDIT_SERVER:
    return {
      ...state,
      selected: action.server,
      creatingOrEditing: true
    };
  default:
    return state;
  }
}
