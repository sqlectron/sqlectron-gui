import * as connTypes from '../actions/connections';
import * as dbTypes from '../actions/databases';
import * as types from '../actions/keys';


const INITIAL_STATE = {
  isFetching: {},
  didInvalidate: false,
  keysByTable: {},
};


export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
  case connTypes.CONNECTION_REQUEST: {
    return action.isServerConnection
      ? { ...INITIAL_STATE, didInvalidate: true }
      : state;
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
  default : return state;
  }
}
