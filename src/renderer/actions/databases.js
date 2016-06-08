import fs from 'fs';
import path from 'path';
import { remote } from 'electron';
import { getCurrentDBConn } from './connections';


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
      let fileName = (getState().databases.fileName || await showSaveDialog());
      if (path.extname(fileName) !== '.json') {
        fileName += '.json';
      }

      await saveFile(fileName, JSON.stringify(diagramJSON));

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


function showSaveDialog() {
  return new Promise((resolve, reject) => {
    remote.dialog.showSaveDialog({
      filters: [
        { name: 'JSON', extensions: ['json'] }
      ],
    }, function (fileName) {
      if (fileName) {
        return resolve(fileName);
      }

      return reject();
    });
  });
}

function saveFile(fileName, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(fileName, data, 'utf8', (err) => {
      if (err) { return reject(err); }
      resolve();
    });
  });
}
