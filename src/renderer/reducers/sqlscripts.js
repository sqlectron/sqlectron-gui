import * as connTypes from '../actions/connections';
import * as types from '../actions/sqlscripts';


const INITIAL_STATE = {
  isFetching: false,
  didInvalidate: false,
  scriptsByObject: {},
};


export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case connTypes.CONNECTION_REQUEST: {
      return action.isServerConnection
        ? { ...INITIAL_STATE, didInvalidate: true }
        : state;
    }
    case types.GET_SCRIPT_REQUEST: {
      return {
        ...state,
        scriptType: action.scriptType,
        isFetching: true,
        didInvalidate: false,
        error: null,
      };
    }
    case types.GET_SCRIPT_SUCCESS: {
      const scriptsByItem = !state.scriptsByObject[action.database]
        ? null
        : state.scriptsByObject[action.database][action.item];
      return {
        ...state,
        isFetching: false,
        didInvalidate: false,
        error: null,
        scriptsByObject: {
          ...state.scriptsByObject,
          [action.database]: {
            ...state.scriptsByObject[action.database],
            [action.item]: {
              ...scriptsByItem,
              objectType: action.objectType,
              [action.actionType]: action.script,
            },
          },
        },
      };
    }
    case types.GET_SCRIPT_FAILURE: {
      return {
        ...state,
        isFetching: false,
        didInvalidate: true,
        error: action.error,
      };
    }
    default : return state;
  }
}
