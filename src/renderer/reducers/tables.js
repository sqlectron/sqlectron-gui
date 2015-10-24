import * as types from '../actions/db';


export default function (state = {
  isFetching: false,
  didInvalidate: false,
  itemsByDatabase: {},
}, action) {
  switch (action.type) {
  case types.DB_CONNECT_SUCCESS: {
    // return { ...state, itemsByDatabase: {}, didInvalidate: true };
    return { ...state, didInvalidate: true };
  }
  case types.DB_FETCH_TABLES_REQUEST: {
    return { ...state, isFetching: true, didInvalidate: false, error: null };
  }
  case types.DB_FETCH_TABLES_SUCCESS: {
    return {
      ...state,
      isFetching: false,
      didInvalidate: false,
      itemsByDatabase: {
        ...state.itemsByDatabase,
        [action.database]: action.tables.map(name => ({ name, visible: true })),
      },
      error: null,
    };
  }
  case types.DB_FETCH_TABLES_FAILURE: {
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
