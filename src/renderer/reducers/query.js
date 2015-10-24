import * as types from '../actions/db';
import {
  UPDATE_SQL_SUCCESS,
} from '../actions/types';

export default function (state = reset(), action) {
  switch (action.type) {
  case types.DB_CONNECT_SUCCESS: {
    return reset();
  }
  case types.DB_EXECUTE_QUERY_REQUEST: {
    return {
      ...reset(),
      isExecuting: true,
      didInvalidate: false,
      query: action.query,
    };
  }
  case types.DB_EXECUTE_QUERY_SUCCESS: {
    return {
      ...reset(),
      didInvalidate: false,
      query: action.query,
      result: action.result,
    };
  }
  case types.DB_EXECUTE_QUERY_FAILURE: {
    return {
      ...reset(),
      query: action.query,
      error: action.error,
    };
  }
  case UPDATE_SQL_SUCCESS:
    return { ...state, query: action.query };

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

// import {
//   EXECUTE_QUERY_SUCCESS,
//   EXECUTE_QUERY_FAILURE,
//   UPDATE_SQL_SUCCESS,
// } from '../actions/types';
//
//
// const initialState = {
//   sql: '',
//   rows: [],
// };
//
//
// export default function query(state = initialState, action) {
//   switch (action.type) {
//   case EXECUTE_QUERY_SUCCESS:
//     return { rows: action.query.rows };
//   case EXECUTE_QUERY_FAILURE:
//     return { rows: [], error: action.error };
//   case UPDATE_SQL_SUCCESS:
//     return { ...state, sql: action.sql };
//
//   default:
//     return state;
//   }
// }
