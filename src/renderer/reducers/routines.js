import * as connTypes from '../actions/connections';
import * as types from '../actions/routines';


const INITIAL_STATE = {
  isFetching: false,
  didInvalidate: false,
  functionsByDatabase: {},
  proceduresByDatabase: {},
};


export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
  case connTypes.CONNECTION_REQUEST: {
    return action.isServerConnection
      ? { ...INITIAL_STATE, didInvalidate: true }
      : state;
  }
  case types.FETCH_ROUTINES_REQUEST: {
    return { ...state, isFetching: true, didInvalidate: false, error: null };
  }
  case types.FETCH_ROUTINES_SUCCESS: {
    return {
      ...state,
      isFetching: false,
      didInvalidate: false,
      functionsByDatabase: {
        ...state.functionsByDatabase,
        [action.database]: action.routines.filter(_isFunction).map(routine => ({
          name: routine.routineName })),
      },
      proceduresByDatabase: {
        ...state.proceduresByDatabase,
        [action.database]: action.routines.filter(_isProcedure).map(routine => ({
          name: routine.routineName })),
      },
      error: null,
    };
  }
  case types.FETCH_ROUTINES_FAILURE: {
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

function _isFunction (routine) {
  return routine.routineType === 'FUNCTION';
}

function _isProcedure (routine) {
  return routine.routineType === 'PROCEDURE';
}
