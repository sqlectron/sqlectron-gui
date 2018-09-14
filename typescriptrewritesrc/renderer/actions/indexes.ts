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


export const FETCH_INDEXES_REQUEST = 'FETCH_INDEXES_REQUEST';
export const FETCH_INDEXES_SUCCESS = 'FETCH_INDEXES_SUCCESS';
export const FETCH_INDEXES_FAILURE = 'FETCH_INDEXES_FAILURE';


export function fetchTableIndexesIfNeeded (database, table) {
  return (dispatch, getState) => {
    if (shouldFetchTableIndexes(getState(), database, table)) {
      dispatch(fetchTableIndexes(database, table));
    }
  };
}


function shouldFetchTableIndexes (state, database, table) {
  const indexes = state.indexes;
  if (!indexes) return true;
  if (indexes.isFetching) return false;
  if (!indexes.indexesByTable[database]) return true;
  if (!indexes.indexesByTable[database][table]) return true;
  return indexes.didInvalidate;
}


function fetchTableIndexes (database, table) {
  return async dispatch => {
    dispatch({ type: FETCH_INDEXES_REQUEST, database, table });
    try {
      const dbConn = getDBConnByName(database);
      const indexes = await dbConn.listTableIndexes(table);
      dispatch({ type: FETCH_INDEXES_SUCCESS, database, table, indexes });
    } catch (error) {
      dispatch({ type: FETCH_INDEXES_FAILURE, error });
    }
  };
}
