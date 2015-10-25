import * as connTypes from '../actions/connections';
import * as types from '../actions/tables';


const INITIAL_STATE = {
  isFetching: false,
  didInvalidate: false,
  itemsByDatabase: {},
};


export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
  case connTypes.CONNECTION_SUCCESS: {
    // return { ...state, itemsByDatabase: {}, didInvalidate: true };
    return { ...state, didInvalidate: true };
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
        [action.database]: action.tables.map(name => ({ name, visible: true })),
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
  default : return state;
  }
}
