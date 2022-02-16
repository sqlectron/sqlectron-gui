import { sqlectron } from '../api';
import { ApplicationState, ThunkResult } from '../reducers';

export const FETCH_COLUMNS_REQUEST = 'FETCH_COLUMNS_REQUEST';
export const FETCH_COLUMNS_SUCCESS = 'FETCH_COLUMNS_SUCCESS';
export const FETCH_COLUMNS_FAILURE = 'FETCH_COLUMNS_FAILURE';

export const FETCH_ALL_COLUMNS_SUCCESS = 'FETCH_ALL_COLUMNS_SUCCESS';
export const FETCH_ALL_COLUMNS_FAILURE = 'FETCH_ALL_COLUMNS_FAILURE';

export function fetchTableColumnsIfNeeded(
  database: string,
  table: string,
  schema?: string,
): ThunkResult<void> {
  return (dispatch, getState) => {
    if (shouldFetchTableColumns(getState(), database, table)) {
      dispatch(fetchTableColumns(database, table, schema));
    }
  };
}

function shouldFetchTableColumns(
  state: ApplicationState,
  database: string,
  table: string,
): boolean {
  const columns = state.columns;
  if (!columns) return true;
  if (columns.isFetching[database] && columns.isFetching[database][table]) return false;
  if (!columns.columnsByTable[database]) return true;
  if (!columns.columnsByTable[database][table]) return true;
  return columns.didInvalidate;
}

function fetchTableColumns(database: string, table: string, schema?: string): ThunkResult<void> {
  return async (dispatch) => {
    dispatch({ type: FETCH_COLUMNS_REQUEST, database, table });
    try {
      const columns = await sqlectron.db.listTableColumns(database, table, schema);
      dispatch({
        type: FETCH_COLUMNS_SUCCESS,
        database,
        table,
        columns,
      });
    } catch (error) {
      dispatch({ type: FETCH_COLUMNS_FAILURE, error });
    }
  };
}

export function fetchAllTableColumns(database: string, schema?: string): ThunkResult<void> {
  return async (dispatch, getState) => {
    const tablecolumns = getState().tablecolumns;
    try {
      for (const table in tablecolumns) {
        // TODO: optimize efficiency
        const columns = await sqlectron.db.listTableColumns(database, table, schema);
        // for only getting columnName
        // const columns = column_infos.map(data => data.columnName);
        dispatch({
          type: FETCH_ALL_COLUMNS_SUCCESS,
          table,
          columns,
        });
      }
    } catch (error) {
      dispatch({ type: FETCH_ALL_COLUMNS_FAILURE, error });
    }
  };
}
