import * as connTypes from '../actions/connections';
import * as dbTypes from '../actions/databases';
import * as types from '../actions/triggers';


const INITIAL_STATE = {
  isFetching: false,
  didInvalidate: false,
  triggersByTable: {},
};


export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case connTypes.CONNECTION_REQUEST: {
      return action.isServerConnection
        ? { ...INITIAL_STATE, didInvalidate: true }
        : state;
    }
    case types.FETCH_TRIGGERS_REQUEST: {
      return { ...state, isFetching: true, didInvalidate: false, error: null };
    }
    case types.FETCH_TRIGGERS_SUCCESS: {
      return {
        ...state,
        isFetching: false,
        didInvalidate: false,
        triggersByTable: {
          ...state.triggersByTable,
          [action.database]: {
            ...state.triggersByTable[action.database],
            [action.table]: action.triggers.map(name => ({ name })),
          },
        },
        error: null,
      };
    }
    case types.FETCH_TRIGGERS_FAILURE: {
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
