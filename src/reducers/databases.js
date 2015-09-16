import { LODAD_DABATASES } from '../constants/action-types';

const initialState = [];

export default function databases(state = initialState, action) {
  switch (action.type) {
  case LODAD_DABATASES:
    return action.databases;

  default:
    return state;
  }
}
