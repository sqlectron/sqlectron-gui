import * as connTypes from '../actions/connections';
import * as types from '../actions/databases';


const INITIAL_STATE = {
  isFetching: false,
  didInvalidate: false,
  items: [],
};


export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
  case connTypes.CONNECTION_SUCCESS: {
    return { ...state, items: [], didInvalidate: true };
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
  default : return state;
  }
}
