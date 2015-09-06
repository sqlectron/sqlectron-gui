// TODO: Check if we gonna keep it.
// Because is not really using it right now.

import { SHOW_DIALOG } from '../constants/ActionTypes';

const initialState = {
  visible: false
};

export default function todos(state = initialState, action) {
  switch (action.type) {
  case SHOW_DIALOG:
    return {
      visible: true,
      ...state
    };

  default:
    return state;
  }
}
