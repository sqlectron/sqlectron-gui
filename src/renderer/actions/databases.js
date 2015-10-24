import { services } from '../../browser/remote';


export const FETCH_DATABASES_REQUEST = 'FETCH_DATABASES_REQUEST';
export const FETCH_DATABASES_SUCCESS = 'FETCH_DATABASES_SUCCESS';
export const FETCH_DATABASES_FAILURE = 'FETCH_DATABASES_FAILURE';
export const FILTER_DATABASES = 'FILTER_DATABASES';


export function filterDatabases(name) {
  return { type: FILTER_DATABASES, name };
}


export function fetchDatabasesIfNeeded () {
  return (dispatch, getState) => {
    if (shouldFetchDatabases(getState())) {
      return dispatch(fetchDatabases());
    }
  };
}


function shouldFetchDatabases (state) {
  const databases = state.databases;
  if (!databases) return true;
  if (databases.isFetching) return false;
  return databases.didInvalidate;
}


function fetchDatabases () {
  return async dispatch => {
    dispatch({ type: FETCH_DATABASES_REQUEST });
    try {
      const databases = await services.db.listDatabases();
      dispatch({ type: FETCH_DATABASES_SUCCESS, databases });
    } catch (error) {
      dispatch({ type: FETCH_DATABASES_FAILURE, error });
    }
  };
}
