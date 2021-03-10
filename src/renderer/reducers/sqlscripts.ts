import { Action, Reducer } from 'redux';
import * as connTypes from '../actions/connections';
import * as types from '../actions/sqlscripts';

export interface ScriptAction extends Action {
  type: string;
  error: Error;
  isServerConnection: boolean;
  database: string;
  item: string;
  script: string;
  scriptType: string;
  objectType: string;
  actionType: string;
}

export interface ScriptState {
  error: null | Error;
  isFetching: boolean;
  didInvalidate: boolean;
  scriptsByObject: {
    [db: string]: {
      [item: string]: string;
    };
  };
  scriptType: string;
}

const INITIAL_STATE: ScriptState = {
  error: null,
  isFetching: false,
  didInvalidate: false,
  scriptsByObject: {},
  scriptType: '',
};

const scriptReducer: Reducer<ScriptState> = function (
  state: ScriptState = INITIAL_STATE,
  action,
): ScriptState {
  switch (action.type) {
    case connTypes.CONNECTION_REQUEST: {
      return action.isServerConnection ? { ...INITIAL_STATE, didInvalidate: true } : state;
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
        ? {}
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
    default:
      return state;
  }
};

export default scriptReducer;
