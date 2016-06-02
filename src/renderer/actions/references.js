import { getDBConnByName } from './connections';


export const FETCH_REFERENCES_REQUEST = 'FETCH_REFERENCES_REQUEST';
export const FETCH_REFERENCES_SUCCESS = 'FETCH_REFERENCES_SUCCESS';
export const FETCH_REFERENCES_FAILURE = 'FETCH_REFERENCES_FAILURE';


export function fetchTableReferencesIfNeeded (database, table) {
  return (dispatch, getState) => {
    if (shouldFetchTableReferences(getState(), database, table)) {
      return dispatch(fetchTableReferences(database, table));
    }
  };
}


function shouldFetchTableReferences (state, database, table) {
  const references = state.references;
  if (!references) return true;
  if (references.isFetching[database] && references.isFetching[database][table]) return false;
  if (!references.referencesByTable[database]) return true;
  if (!references.referencesByTable[database][table]) return true;
  return references.didInvalidate;
}


function fetchTableReferences (database, table) {
  return async dispatch => {
    dispatch({ type: FETCH_REFERENCES_REQUEST, database, table });
    try {
      const dbConn = getDBConnByName(database);
      const references = await dbConn.getTableReferences(table);
      dispatch({ type: FETCH_REFERENCES_SUCCESS, database, table, references });
    } catch (error) {
      dispatch({ type: FETCH_REFERENCES_FAILURE, error });
    }
  };
}
