import { EXECUTE_QUERY_SUCCESS, EXECUTE_QUERY_FAILURE } from '../constants/action-types';

const initialState = {
  rows: []
};

export default function query(state = initialState, action) {
  switch (action.type) {
  case EXECUTE_QUERY_SUCCESS:
    return { rows: action.query.rows };
  case EXECUTE_QUERY_FAILURE:
    return { rows: [], error: action.error };

  default:
    return state;
  }
}
