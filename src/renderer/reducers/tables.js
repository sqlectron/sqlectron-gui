import * as connTypes from '../actions/connections';
import * as queryTypes from '../actions/queries';
import * as types from '../actions/tables';


const INITIAL_STATE = {
  isFetching: false,
  didInvalidate: false,
  itemsByDatabase: {},
};


const COMMANDS_TRIGER_REFRESH = ['CREATE_TABLE', 'DROP_TABLE'];


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
  case queryTypes.EXECUTE_QUERY_SUCCESS: {
    return {
      ...state,
      didInvalidate: action.results
        .some(({ command }) => COMMANDS_TRIGER_REFRESH.includes(command)),
    };
  }
  default : return state;
  }
}
