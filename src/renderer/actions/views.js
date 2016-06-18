import { getCurrentDBConn } from './connections';


export const FETCH_VIEWS_REQUEST = 'FETCH_VIEWS_REQUEST';
export const FETCH_VIEWS_SUCCESS = 'FETCH_VIEWS_SUCCESS';
export const FETCH_VIEWS_FAILURE = 'FETCH_VIEWS_FAILURE';


export function fetchViewsIfNeeded (database) {
  return (dispatch, getState) => {
    if (shouldFetchViews(getState(), database)) {
      dispatch(fetchViews(database));
    }
  };
}

function shouldFetchViews (state, database) {
  const views = state.views;
  if (!views) return true;
  if (views.isFetching) return false;
  if (!views.viewsByDatabase[database]) return true;
  return views.didInvalidate;
}

function fetchViews (database) {
  return async (dispatch, getState) => {
    dispatch({ type: FETCH_VIEWS_REQUEST, database });
    try {
      const dbConn = getCurrentDBConn(getState());
      const views = await dbConn.listViews();
      dispatch({ type: FETCH_VIEWS_SUCCESS, database, views });
    } catch (error) {
      dispatch({ type: FETCH_VIEWS_FAILURE, error });
    }
  };
}
