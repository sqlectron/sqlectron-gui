import * as connTypes from '../actions/connections';
import * as types from '../actions/tables';


const INITIAL_STATE = {
  isFetching: false,
  didInvalidate: false,
  itemsByDatabase: {},
  isFetchingColumns: false,
  columnsByTable: {},
};


export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
  case connTypes.CONNECTION_REQUEST: {
    return action.isServerConnection
      ? { ...INITIAL_STATE, didInvalidate: true }
      : state;
  }
  case types.FETCH_TABLES_REQUEST: {
    return { ...state, isFetching: true, didInvalidate: false, error: null };
  }
  case types.FETCH_TABLES_SUCCESS: {
    return {
      ...state,
      isFetching: false,
      didInvalidate: false,
      itemsByDatabase: {
        ...state.itemsByDatabase,
        [action.database]: action.tables.map(name => ({ name })),
      },
      error: null,
    };
  }
  case types.FETCH_TABLES_FAILURE: {
    return {
      ...state,
      isFetching: false,
      didInvalidate: true,
      error: action.error,
    };
  }
  case types.FETCH_COLUMNS_REQUEST: {
    return { ...state, isFetchingColumns: true, didInvalidate: false, rror: null};
  }
  case types.FETCH_COLUMNS_SUCCESS: {
    return {
      ...state,
      isFetchingColumns: false,
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
