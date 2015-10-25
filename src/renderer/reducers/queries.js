import * as connTypes from '../actions/connections';
import * as types from '../actions/queries';


const INITIAL_STATE = {
  isExecuting: false,
  didInvalidate: true,
  query: '',
  result: null,
  error: null,
};


export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
  case connTypes.CONNECTION_SUCCESS: {
    return INITIAL_STATE;
  }
  case types.EXECUTE_QUERY_REQUEST: {
    return {
      ...INITIAL_STATE,
      isExecuting: true,
      didInvalidate: false,
      query: action.query,
    };
  }
  case types.EXECUTE_QUERY_SUCCESS: {
    return {
      ...INITIAL_STATE,
      didInvalidate: false,
      query: action.query,
      result: action.result,
    };
  }
  case types.EXECUTE_QUERY_FAILURE: {
    return {
      ...INITIAL_STATE,
      query: action.query,
      error: action.error,
    };
  }
  case types.UPDATE_QUERY: {
    return {
      ...INITIAL_STATE,
      query: action.query,
    };
  }

  default : return state;
  }
}
