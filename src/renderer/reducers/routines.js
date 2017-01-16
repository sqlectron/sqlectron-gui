import * as connTypes from '../actions/connections';
import * as dbTypes from '../actions/databases';
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
          [action.database]: action.routines.filter(isFunction).map(routine => ({
            schema: routine.schema,
            name: routine.routineName,
            routineDefinition: routine.routineDefinition,
          })),
        },
        proceduresByDatabase: {
          ...state.proceduresByDatabase,
          [action.database]: action.routines.filter(isProcedure).map(routine => ({
            schema: routine.schema,
            name: routine.routineName,
            routineDefinition: routine.routineDefinition,
          })),
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
    case dbTypes.REFRESH_DATABASES: {
      return {
        ...state,
        didInvalidate: true,
      };
    }
    default : return state;
  }
}

function isFunction (routine) {
  return routine.routineType === 'FUNCTION';
}

function isProcedure (routine) {
  return routine.routineType === 'PROCEDURE';
}
