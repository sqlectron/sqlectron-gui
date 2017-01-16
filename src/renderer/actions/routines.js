import { getCurrentDBConn } from './connections';


export const FETCH_ROUTINES_REQUEST = 'FETCH_ROUTINES_REQUEST';
export const FETCH_ROUTINES_SUCCESS = 'FETCH_ROUTINES_SUCCESS';
export const FETCH_ROUTINES_FAILURE = 'FETCH_ROUTINES_FAILURE';


export function fetchRoutinesIfNeeded (database, filter) {
  return (dispatch, getState) => {
    if (shouldFetchRoutines(getState(), database)) {
      dispatch(fetchRoutines(database, filter));
    }
  };
}

function shouldFetchRoutines (state, database) {
  const routines = state.routines;
  if (!routines) return true;
  if (routines.isFetching) return false;
  if (!routines.functionsByDatabase[database]) return true;
  if (!routines.proceduresByDatabase[database]) return true;
  return routines.didInvalidate;
}

function fetchRoutines (database, filter) {
  return async (dispatch, getState) => {
    dispatch({ type: FETCH_ROUTINES_REQUEST, database });
    try {
      const dbConn = getCurrentDBConn(getState());
      const routines = await dbConn.listRoutines(filter);
      dispatch({ type: FETCH_ROUTINES_SUCCESS, database, routines });
    } catch (error) {
      dispatch({ type: FETCH_ROUTINES_FAILURE, error });
    }
  };
}
