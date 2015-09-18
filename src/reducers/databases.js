
import { LOAD_DATABASES_SUCCESS } from '../actions/types';

const initialState = [];

export default function databases(state = initialState, action) {
  switch (action.type) {
  case LOAD_DATABASES_SUCCESS:
    return action.databases;

  default:
    return state;
  }
}
