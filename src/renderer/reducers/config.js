import * as types from '../actions/config';


const INITIAL_STATE = {
  isSaving: false,
  isEditing: false,
  path: null,
  data: null,
  error: null,
  isLoaded: false,
};


export default function config(state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.LOAD_CONFIG_SUCCESS:
      return {
        ...state,
        data: action.config,
        path: action.path,
        isLoaded: true,
      };
    case types.LOAD_CONFIG_FAILURE: {
      return {
        ...state,
        error: action.error,
        isLoaded: true,
      };
    }
    case types.START_EDITING_CONFIG: {
      return {
        ...state,
        isSaving: false,
        isEditing: true,
      };
    }
    case types.FINISH_EDITING_CONFIG: {
      return {
        ...state,
        isSaving: false,
        isEditing: false,
        isLoaded: true,
        error: null,
      };
    }
    case types.SAVE_CONFIG_REQUEST: {
      return {
        ...state,
        isSaving: true,
      };
    }
    case types.SAVE_CONFIG_SUCCESS: {
      return {
        data: {
          ...state.data,
          ...action.config,
        },
        isSaving: false,
      };
    }
    default:
      return state;
  }
}
