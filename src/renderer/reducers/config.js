import * as types from '../actions/config';


const INITIAL_STATE = {
  data: null,
  error: null,
};


export default function config(state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.LOAD_CONFIG_SUCCESS:
      return {
        ...state,
        data: action.config,
      };
    case types.LOAD_CONFIG_FAILURE: {
      return {
        ...state,
        error: action.error,
      };
    }
    default:
      return state;
  }
}
