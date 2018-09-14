/**
 * unified-dataloader-gui
 * Copyright (C) 2018 Armarti Industries
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
import { getDBConnByName } from './connections';


export const FETCH_COLUMNS_REQUEST = 'FETCH_COLUMNS_REQUEST';
export const FETCH_COLUMNS_SUCCESS = 'FETCH_COLUMNS_SUCCESS';
export const FETCH_COLUMNS_FAILURE = 'FETCH_COLUMNS_FAILURE';


export function fetchTableColumnsIfNeeded (database, table, schema) {
  return (dispatch, getState) => {
    if (shouldFetchTableColumns(getState(), database, table, schema)) {
      dispatch(fetchTableColumns(database, table, schema));
    }
  };
}


function shouldFetchTableColumns (state, database, table) {
  const columns = state.columns;
  if (!columns) return true;
  if (columns.isFetching[database] && columns.isFetching[database][table]) return false;
  if (!columns.columnsByTable[database]) return true;
  if (!columns.columnsByTable[database][table]) return true;
  return columns.didInvalidate;
}


function fetchTableColumns (database, table, schema) {
  return async dispatch => {
    dispatch({ type: FETCH_COLUMNS_REQUEST, database, table });
    try {
      const dbConn = getDBConnByName(database);
      const columns = await dbConn.listTableColumns(table, schema);
      dispatch({ type: FETCH_COLUMNS_SUCCESS, database, table, columns });
    } catch (error) {
      dispatch({ type: FETCH_COLUMNS_FAILURE, error });
    }
  };
}
