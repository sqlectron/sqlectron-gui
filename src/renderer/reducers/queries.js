import * as connTypes from '../actions/connections';
import * as types from '../actions/queries';

export default function (state = reset(), action) {
  switch (action.type) {
  case connTypes.CONNECTION_SUCCESS: {
    return reset();
  }
  case types.EXECUTE_QUERY_REQUEST: {
    return {
      ...reset(),
      isExecuting: true,
      didInvalidate: false,
      query: action.query,
    };
  }
  case types.EXECUTE_QUERY_SUCCESS: {
    return {
      ...reset(),
      didInvalidate: false,
      query: action.query,
      result: action.result,
    };
  }
  case types.EXECUTE_QUERY_FAILURE: {
    return {
      ...reset(),
      query: action.query,
      error: action.error,
    };
  }
  case types.UPDATE_QUERY: {
    return {
      ...reset(),
      query: action.query,
    };
  }

  default : return state;
  }
}


function reset () {
  return {
    isExecuting: false,
    didInvalidate: true,
    query: '',
    result: null,
    error: null,
  };
}
