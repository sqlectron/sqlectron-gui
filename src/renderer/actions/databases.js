import path from 'path';
import { getCurrentDBConn } from './connections';
import * as FileHandler from '../utils/file-handler';


export const REFRESH_DATABASES = 'REFRESH_DATABASES';
export const FETCH_DATABASES_REQUEST = 'FETCH_DATABASES_REQUEST';
export const FETCH_DATABASES_SUCCESS = 'FETCH_DATABASES_SUCCESS';
export const FETCH_DATABASES_FAILURE = 'FETCH_DATABASES_FAILURE';
export const FILTER_DATABASES = 'FILTER_DATABASES';
export const SHOW_DATABASE_DIAGRAM = 'SHOW_DATABASE_DIAGRAM';
export const CLOSE_DATABASE_DIAGRAM = 'CLOSE_DATABASE_DIAGRAM';
export const SAVE_DIAGRAM_REQUEST = 'SAVE_DIAGRAM_REQUEST';
export const SAVE_DIAGRAM_SUCCESS = 'SAVE_DIAGRAM_SUCCESS';
export const SAVE_DIAGRAM_FAILURE = 'SAVE_DIAGRAM_FAILURE';


export function filterDatabases(name) {
  return { type: FILTER_DATABASES, name };
}


export function refreshDatabase(name) {
  return { type: REFRESH_DATABASES, name };
}

export function showDatabaseDiagram(name) {
  return { type: SHOW_DATABASE_DIAGRAM, name };
}

export function closeDatabaseDiagram() {
  return { type: CLOSE_DATABASE_DIAGRAM };
}

export function saveDatabaseDiagram(diagramJSON) {
  return async (dispatch, getState) => {
    dispatch({ type: SAVE_DIAGRAM_REQUEST });
    try {
      const filters = [ { name: 'JSON', extensions: ['json'] }];

      let fileName = (getState().databases.fileName || await FileHandler.showSaveDialog(filters));
      if (path.extname(fileName) !== '.json') {
        fileName += '.json';
      }

      await FileHandler.saveFile(fileName, JSON.stringify(diagramJSON));

      dispatch({ type: SAVE_DIAGRAM_SUCCESS, fileName });
    } catch (error) {
      dispatch({ type: SAVE_DIAGRAM_FAILURE, error });
    }
  };
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
  return async (dispatch, getState) => {
    dispatch({ type: FETCH_DATABASES_REQUEST });
    try {
      const dbConn = getCurrentDBConn(getState());
      const databases = await dbConn.listDatabases();
      dispatch({ type: FETCH_DATABASES_SUCCESS, databases });
    } catch (error) {
      dispatch({ type: FETCH_DATABASES_FAILURE, error });
    }
  };
}
