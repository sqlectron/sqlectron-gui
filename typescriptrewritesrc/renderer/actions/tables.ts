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
import { getCurrentDBConn } from './connections';


export const FETCH_TABLES_REQUEST = 'FETCH_TABLES_REQUEST';
export const FETCH_TABLES_SUCCESS = 'FETCH_TABLES_SUCCESS';
export const FETCH_TABLES_FAILURE = 'FETCH_TABLES_FAILURE';
export const SELECT_TABLES_FOR_DIAGRAM = 'SELECT_TABLES_FOR_DIAGRAM';


export function selectTablesForDiagram(tables) {
  return { type: SELECT_TABLES_FOR_DIAGRAM, tables };
}


export function fetchTablesIfNeeded (database, filter) {
  return (dispatch, getState) => {
    if (shouldFetchTables(getState(), database)) {
      dispatch(fetchTables(database, filter));
    }
  };
}


function shouldFetchTables (state, database) {
  const tables = state.tables;
  if (!tables) return true;
  if (tables.isFetching) return false;
  if (!tables.itemsByDatabase[database]) return true;
  return tables.didInvalidate;
}


function fetchTables (database, filter) {
  return async (dispatch, getState) => {
    dispatch({ type: FETCH_TABLES_REQUEST, database });
    try {
      const dbConn = getCurrentDBConn(getState());
      const tables = await dbConn.listTables(filter);
      dispatch({ type: FETCH_TABLES_SUCCESS, database, tables });
    } catch (error) {
      dispatch({ type: FETCH_TABLES_FAILURE, error });
    }
  };
}
