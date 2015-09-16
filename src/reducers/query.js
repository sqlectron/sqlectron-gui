import { UPDATE_SQL, EXECUTE_QUERY, FAIL_QUERY } from '../constants/action-types';

const initialState = {
  sql: '',
  rows: []
};

export default function query(state = initialState, action) {
  switch (action.type) {
  case UPDATE_SQL:
    return { ...state, sql: action.sql };
  case EXECUTE_QUERY:
    return { rows: action.queryResult.rows };
  case FAIL_QUERY:
    return { rows: [], error: action.error };

  default:
    return state;
  }
}
