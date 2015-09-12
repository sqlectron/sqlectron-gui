import { LODAD_CONNECTIONS, EDIT_CONNECTION } from '../constants/action-types';

const initialState = [];

export default function todos(state = initialState, action) {
  switch (action.type) {
  case LODAD_CONNECTIONS:
    return action.connections;
  default:
    return state;
  }
}
