import * as connTypes from '../actions/connections';
import * as dbTypes from '../actions/databases';
import * as types from '../actions/indexes';


const INITIAL_STATE = {
  isFetching: false,
  didInvalidate: false,
  indexesByTable: {},
};


export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case connTypes.CONNECTION_REQUEST: {
      return action.isServerConnection
        ? { ...INITIAL_STATE, didInvalidate: true }
        : state;
    }
    case types.FETCH_INDEXES_REQUEST: {
      return { ...state, isFetching: true, didInvalidate: false, error: null };
    }
    case types.FETCH_INDEXES_SUCCESS: {
      return {
        ...state,
        isFetching: false,
        didInvalidate: false,
        indexesByTable: {
          ...state.indexesByTable,
          [action.database]: {
            ...state.indexesByTable[action.database],
            [action.table]: action.indexes.map(name => ({ name })),
          },
        },
        error: null,
      };
    }
    case types.FETCH_INDEXES_FAILURE: {
      return {
        ...state,
        isFetching: false,
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
