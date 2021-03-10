import { Action, Reducer } from 'redux';
import * as connTypes from '../actions/connections';
import * as dbTypes from '../actions/databases';
import * as types from '../actions/keys';

export interface Key {
  name: string;
}

export interface KeyAction extends Action {
  type: string;
  error: Error;
  isServerConnection: boolean;
  database: string;
  table: string;
  tableKeys: Array<Key>;
}

export interface KeyState {
  error: null | Error;
  didInvalidate: boolean;
  isFetching: {
    [database: string]: {
      [table: string]: boolean;
    };
  };
  keysByTable: {
    [table: string]: Key;
  };
}

const INITIAL_STATE: KeyState = {
  error: null,
  isFetching: {},
  didInvalidate: false,
  keysByTable: {},
};

const keyReducer: Reducer<KeyState> = function (state: KeyState = INITIAL_STATE, action): KeyState {
  switch (action.type) {
    case connTypes.CONNECTION_REQUEST: {
      return action.isServerConnection ? { ...INITIAL_STATE, didInvalidate: true } : state;
    }

    case types.FETCH_KEYS_REQUEST: {
      return {
        ...state,
        isFetching: {
          ...state.isFetching,
          [action.database]: {
            ...state.isFetching[action.database],
            [action.table]: true,
          },
        },
        didInvalidate: false,
        error: null,
      };
    }
    case types.FETCH_KEYS_SUCCESS: {
      return {
        ...state,
        isFetching: {
          ...state.isFetching,
          [action.database]: {
            ...state.isFetching[action.database],
            [action.table]: false,
          },
        },
        didInvalidate: false,
        keysByTable: {
          ...state.keysByTable,
          [action.database]: {
            ...state.keysByTable[action.database],
            [action.table]: action.tableKeys,
          },
        },
        error: null,
      };
    }
    case types.FETCH_KEYS_FAILURE: {
      return {
        ...state,
        isFetching: {
          ...state.isFetching,
          [action.database]: {
            ...state.isFetching[action.database],
            [action.table]: false,
          },
        },
        didInvalidate: true,
        error: action.error,
      };
    }
    case dbTypes.REFRESH_DATABASES: {
      return {
        ...state,
        didInvalidate: true,
      };
    }
    default:
      return state;
  }
};

export default keyReducer;
