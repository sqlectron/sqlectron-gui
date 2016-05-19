import * as connTypes from '../actions/connections';
import * as queryTypes from '../actions/queries';
import * as types from '../actions/databases';


const INITIAL_STATE = {
  isFetching: false,
  didInvalidate: false,
  items: [],
};


const COMMANDS_TRIGER_REFRESH = ['CREATE_DATABASE', 'DROP_DATABASE'];


export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
  case connTypes.CONNECTION_REQUEST: {
    return action.isServerConnection
      ? { ...INITIAL_STATE, didInvalidate: true }
      : state;
  }
  case types.FETCH_DATABASES_REQUEST: {
    return { ...state, isFetching: true, didInvalidate: false, error: null };
  }
  case types.FETCH_DATABASES_SUCCESS: {
    return {
      ...state,
      isFetching: false,
      didInvalidate: false,
      items: action.databases.map(name => ({ name })),
      error: null,
    };
  }
  case types.FETCH_DATABASES_FAILURE: {
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
