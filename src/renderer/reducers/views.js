import * as connTypes from '../actions/connections';
import * as types from '../actions/views';


const INITIAL_STATE = {
  isFetching: false,
  didInvalidate: false,
  viewsByDatabase: {},
};


export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case connTypes.CONNECTION_REQUEST: {
      return action.isServerConnection
        ? { ...INITIAL_STATE, didInvalidate: true }
        : state;
    }
    case types.FETCH_VIEWS_REQUEST: {
      return { ...state, isFetching: true, didInvalidate: false, error: null };
    }
    case types.FETCH_VIEWS_SUCCESS: {
      return {
        ...state,
        isFetching: false,
        didInvalidate: false,
        viewsByDatabase: {
          ...state.viewsByDatabase,
          [action.database]: action.views.map(name => ({ name })),
        },
        error: null,
      };
    }
    case types.FETCH_VIEWS_FAILURE: {
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
