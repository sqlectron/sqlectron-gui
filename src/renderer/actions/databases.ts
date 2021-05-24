import { AnyAction } from 'redux';
import html2canvas from 'html2canvas';
import { ApplicationState, ThunkResult } from '../reducers';
import { getDatabaseByQueryID } from './connections';
import { sqlectron } from '../api';
import * as FileHandler from '../utils/file';
import type { DatabaseFilter } from '../../common/types/database';

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

export function filterDatabases(name: string): AnyAction {
  return { type: FILTER_DATABASES, name };
}

export function refreshDatabase(name: string): AnyAction {
  return { type: REFRESH_DATABASES, name };
}

export function showDatabaseDiagram(name: string): AnyAction {
  return { type: SHOW_DATABASE_DIAGRAM, name };
}

export function closeDatabaseDiagram(): AnyAction {
  return { type: CLOSE_DATABASE_DIAGRAM };
}

export function generateDatabaseDiagram(): AnyAction {
  return { type: GENERATE_DATABASE_DIAGRAM };
}

export function saveDatabaseDiagram(diagramJSON: unknown): ThunkResult<void> {
  return async (dispatch, getState) => {
    dispatch({ type: SAVE_DIAGRAM_REQUEST });
    try {
      const fileName = sqlectron.db.saveDatabaseDiagram(
        getState().databases.fileName || '',
        diagramJSON,
      );

      dispatch({ type: SAVE_DIAGRAM_SUCCESS, fileName });
    } catch (error) {
      dispatch({ type: SAVE_DIAGRAM_FAILURE, error });
    }
  };
}

export function exportDatabaseDiagram(
  diagram: { scrollIntoView: () => void },
  imageType: string,
): ThunkResult<void> {
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

      const buff = Buffer.from(imageData, 'base64');

      await FileHandler.saveFile(fileName, buff, 'binary');

      dispatch({ type: EXPORT_DIAGRAM_SUCCESS });
    } catch (error) {
      dispatch({ type: EXPORT_DIAGRAM_FAILURE, error });
    }
  };
}

export function openDatabaseDiagram(): ThunkResult<void> {
  return async (dispatch, getState) => {
    dispatch({ type: OPEN_DIAGRAM_REQUEST });
    try {
      // Path user used last for save or open diagram in the same session. If such exists.
      const { filename, diagram } = await sqlectron.db.openDatabaseDiagram(
        getState().databases.fileName || '',
      );

      dispatch({ type: OPEN_DIAGRAM_SUCCESS, fileName: filename, diagramJSON: diagram });
    } catch (error) {
      dispatch({ type: OPEN_DIAGRAM_FAILURE, error });
    }
  };
}

export function fetchDatabasesIfNeeded(filter: DatabaseFilter): ThunkResult<void> {
  return (dispatch, getState) => {
    if (shouldFetchDatabases(getState())) {
      dispatch(fetchDatabases(filter));
    }
  };
}

function shouldFetchDatabases(state: ApplicationState): boolean {
  const databases = state.databases;
  if (!databases) return true;
  if (databases.isFetching) return false;
  return databases.didInvalidate;
}

function fetchDatabases(filter: DatabaseFilter): ThunkResult<void> {
  return async (dispatch, getState) => {
    dispatch({ type: FETCH_DATABASES_REQUEST });
    try {
      const database = getDatabaseByQueryID(getState());
      const databases = await sqlectron.db.listDatabases(database, filter);
      dispatch({ type: FETCH_DATABASES_SUCCESS, databases });
    } catch (error) {
      dispatch({ type: FETCH_DATABASES_FAILURE, error });
    }
  };
}
