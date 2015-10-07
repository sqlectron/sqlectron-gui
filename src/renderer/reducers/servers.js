import { LOAD_SERVERS_SUCCESS } from '../actions/types';

const initialState = [];

export default function servers(state = initialState, action) {
  switch (action.type) {
  case LOAD_SERVERS_SUCCESS:
    return action.servers;
  default:
    return state;
  }
}
