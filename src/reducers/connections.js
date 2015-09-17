import { LOAD_CONNECTIONS_SUCCESS } from '../constants/action-types';

const initialState = [];

export default function connections(state = initialState, action) {
  switch (action.type) {
  case LOAD_CONNECTIONS_SUCCESS:
    return action.connections;
  default:
    return state;
  }
}
