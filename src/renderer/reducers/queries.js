import * as connTypes from '../actions/connections';
import * as types from '../actions/queries';

const INITIAL_STATE = {
  isExecuting: false,
  didInvalidate: true,
  query: '',
  queryHistory: [],
  resultFields: null,
  resultRows: null,
  error: null,
};


export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
  case connTypes.CONNECTION_SUCCESS: {
    return INITIAL_STATE;
  }
  case types.EXECUTE_QUERY_REQUEST: {
    return {
      ...state,
      isExecuting: true,
      didInvalidate: false,
      query: action.query,
      queryHistory: [
        ...state.queryHistory,
        action.query,
      ],
    };
  }
  case types.EXECUTE_QUERY_SUCCESS: {
    return {
      ...state,
      error: null,
      isExecuting: false,
      resultFields: action.result.fields,
      resultRows: action.result.rows,
      resultRowCount: action.result.rowCount,
      resultAffectedRows: action.result.affectedRows,
    };
  }
  case types.EXECUTE_QUERY_FAILURE: {
    return {
      ...state,
      resultFields: null,
      resultRows: null,
      isExecuting: false,
      query: action.query,
      error: action.error,
    };
  }
  case types.UPDATE_QUERY: {
    return {
      ...state,
      query: action.query,
    };
  }

  default : return state;
  }
}
