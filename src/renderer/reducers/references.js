import * as connTypes from '../actions/connections';
import * as dbTypes from '../actions/databases';
import * as types from '../actions/references';


const INITIAL_STATE = {
  isFetching: {},
  didInvalidate: false,
  referencesByTable: {},
};


export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
  case connTypes.CONNECTION_REQUEST: {
    return action.isServerConnection
      ? { ...INITIAL_STATE, didInvalidate: true }
      : state;
  }
  case types.FETCH_REFERENCES_REQUEST: {
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
  case types.FETCH_REFERENCES_SUCCESS: {
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
      referencesByTable: {
        ...state.referencesByTable,
        [action.database]: {
          ...state.referencesByTable[action.database],
          [action.table]: action.references.map(linksTo => ({ linksTo })),
        },
      },
      error: null,
    };
  }
  case types.FETCH_REFERENCES_FAILURE: {
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
