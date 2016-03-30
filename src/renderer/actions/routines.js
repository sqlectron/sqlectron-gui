import { getCurrentDBConn } from './connections';


export const FETCH_ROUTINES_REQUEST = 'FETCH_ROUTINES_REQUEST';
export const FETCH_ROUTINES_SUCCESS = 'FETCH_ROUTINES_SUCCESS';
export const FETCH_ROUTINES_FAILURE = 'FETCH_ROUTINES_FAILURE';


export function fetchRoutinesIfNeeded (database) {
  return (dispatch, getState) => {
    if (shouldFetchRoutines(getState())) {
      return dispatch(fetchRoutines(database));
    }
  };
}

function shouldFetchRoutines (state) {
  const routines = state.routines;
  if (!routines) return true;
  if (routines.isFetching) return false;
  return routines.didInvalidate;
}

function fetchRoutines (database) {
  return async (dispatch, getState) => {
    dispatch({ type: FETCH_ROUTINES_REQUEST, database });
    try {
      const dbConn = getCurrentDBConn(getState());
      const routines = await dbConn.listRoutines();
      dispatch({ type: FETCH_ROUTINES_SUCCESS, database, routines });
    } catch (error) {
      dispatch({ type: FETCH_ROUTINES_FAILURE, error });
    }
  };
}
