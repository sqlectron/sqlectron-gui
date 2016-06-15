import path from 'path';
import html2canvas from 'html2canvas';
import { getCurrentDBConn } from './connections';
import * as FileHandler from '../utils/file-handler';


export const REFRESH_DATABASES = 'REFRESH_DATABASES';
export const FETCH_DATABASES_REQUEST = 'FETCH_DATABASES_REQUEST';
export const FETCH_DATABASES_SUCCESS = 'FETCH_DATABASES_SUCCESS';
export const FETCH_DATABASES_FAILURE = 'FETCH_DATABASES_FAILURE';
export const FILTER_DATABASES = 'FILTER_DATABASES';
export const SHOW_DATABASE_DIAGRAM = 'SHOW_DATABASE_DIAGRAM';
export const CLOSE_DATABASE_DIAGRAM = 'CLOSE_DATABASE_DIAGRAM';
export const GENERATE_DATABASE_DIAGRAM = 'GENERATE_DATABASE_DIAGRAM';
export const SAVE_DIAGRAM_REQUEST = 'SAVE_DIAGRAM_REQUEST';
export const SAVE_DIAGRAM_SUCCESS = 'SAVE_DIAGRAM_SUCCESS';
export const SAVE_DIAGRAM_FAILURE = 'SAVE_DIAGRAM_FAILURE';
export const OPEN_DIAGRAM_REQUEST = 'OPEN_DIAGRAM_REQUEST';
export const OPEN_DIAGRAM_SUCCESS = 'OPEN_DIAGRAM_SUCCESS';
export const OPEN_DIAGRAM_FAILURE = 'OPEN_DIAGRAM_FAILURE';
export const EXPORT_DIAGRAM_REQUEST = 'EXPORT_DIAGRAM_REQUEST';
export const EXPORT_DIAGRAM_SUCCESS = 'EXPORT_DIAGRAM_SUCCESS';
export const EXPORT_DIAGRAM_FAILURE = 'EXPORT_DIAGRAM_FAILURE';


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

export function generateDatabaseDiagram() {
  return { type: GENERATE_DATABASE_DIAGRAM };
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

export function exportDatabaseDiagram(diagram, imageType) {
  return async (dispatch) => {
    dispatch({ type: EXPORT_DIAGRAM_REQUEST });
    try {
      // html2canvas library only captures elements in window view
      diagram.scrollIntoView();

      const filters = [{ name: 'Images', extensions: [imageType] }];
      const fileName = await FileHandler.showSaveDialog(filters);

      // Create image
      const canvas = await html2canvas(diagram, { background: '#fff' });
      const image = await canvas.toDataURL(`image/${imageType}`);
      const imageData = image.replace(/^data:image\/\w+;base64,/, '');
      const buff = new Buffer(imageData, 'base64');

      await FileHandler.saveFile(fileName, buff, 'binary');

      dispatch({ type: EXPORT_DIAGRAM_SUCCESS });
    } catch (error) {
      dispatch({ type: EXPORT_DIAGRAM_FAILURE, error });
    }
  };
}

export function openDatabaseDiagram() {
  return async (dispatch, getState) => {
    dispatch({ type: OPEN_DIAGRAM_REQUEST });
    try {
      // Path user used last for save or open diagram in the same session. If such exists.
      const defaultPath = path.dirname(getState().databases.fileName || '');
      const filters = [ { name: 'JSON', extensions: ['json'] }];

      const [fileName] = await FileHandler.showOpenDialog(filters, defaultPath);

      const diagramJSON = await FileHandler.openFile(fileName);

      dispatch({ type: OPEN_DIAGRAM_SUCCESS, fileName, diagramJSON });
    } catch (error) {
      dispatch({ type: OPEN_DIAGRAM_FAILURE, error });
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
