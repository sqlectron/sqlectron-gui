import * as connTypes from '../actions/connections';
import * as types from '../actions/queries';

const INITIAL_STATE = {
  isExecuting: false,
  isDefaultSelect: false,
  didInvalidate: true,
  query: '',
  queryHistory: [],
  resultFields: null,
  resultRows: null,
  error: null,
  copied: null,
};


export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
  case connTypes.CONNECTION_SUCCESS: {
    return INITIAL_STATE;
  }
  case types.EXECUTE_QUERY_REQUEST: {
    return {
      ...state,
      copied: false,
      isExecuting: true,
      isDefaultSelect: action.isDefaultSelect,
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
      copied: false,
    };
  }
  case types.COPY_QUERY_RESULT_TO_CLIPBOARD_REQUEST: {
    return {
      ...state,
      error: null,
      copied: false,
    };
  }
  case types.COPY_QUERY_RESULT_TO_CLIPBOARD_SUCCESS: {
    return {
      ...state,
      copied: true,
    };
  }
  case types.COPY_QUERY_RESULT_TO_CLIPBOARD_FAIL: {
    return {
      ...state,
      error: action.error,
      copied: false,
    };
  }

  default : return state;
  }
}
