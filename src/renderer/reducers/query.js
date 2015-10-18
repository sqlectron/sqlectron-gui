import {
  EXECUTE_QUERY_SUCCESS,
  EXECUTE_QUERY_FAILURE,
  UPDATE_SQL_SUCCESS,
} from '../actions/types';


const initialState = {
  sql: '',
  rows: [],
};


export default function query(state = initialState, action) {
  switch (action.type) {
  case EXECUTE_QUERY_SUCCESS:
    return { rows: action.query.rows };
  case EXECUTE_QUERY_FAILURE:
    return { rows: [], error: action.error };
  case UPDATE_SQL_SUCCESS:
    return { ...state, sql: action.sql };

  default:
    return state;
  }
}
