import { EXECUTE_QUERY } from '../constants/action-types';

const initialState = {
  rows: []
};

export default function query(state = initialState, action) {
  switch (action.type) {
  case EXECUTE_QUERY:
    return { rows: action.queryResult.rows };

  default:
    return state;
  }
}
