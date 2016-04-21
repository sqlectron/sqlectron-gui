import * as connTypes from '../actions/connections';
import * as types from '../actions/columns';


const INITIAL_STATE = {
  isFetching: false,
  didInvalidate: false,
  columnsByTable: {},
};


export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
  case connTypes.CONNECTION_REQUEST: {
    return action.isServerConnection
      ? { ...INITIAL_STATE, didInvalidate: true }
      : state;
  }
  case types.FETCH_COLUMNS_REQUEST: {
    return { ...state, isFetching: true, didInvalidate: false, error: null};
  }
  case types.FETCH_COLUMNS_SUCCESS: {
    return {
      ...state,
      isFetching: false,
      didInvalidate: false,
      columnsByTable: {
        ...state.columnsByTable,
        [action.database]: {
          ...state.columnsByTable[action.database],
          [action.table]: action.columns.map(name => ({name})),
        },
      },
      error: null,
    };
  }
  case types.FETCH_COLUMNS_FAILURE: {
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
