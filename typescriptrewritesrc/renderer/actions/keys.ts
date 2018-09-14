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


export const FETCH_KEYS_REQUEST = 'FETCH_KEYS_REQUEST';
export const FETCH_KEYS_SUCCESS = 'FETCH_KEYS_SUCCESS';
export const FETCH_KEYS_FAILURE = 'FETCH_KEYS_FAILURE';


export function fetchTableKeysIfNeeded (database, table, schema) {
  return (dispatch, getState) => {
    if (shouldFetchTableKeys(getState(), database, table)) {
      dispatch(fetchTableKeys(database, table, schema));
    }
  };
}


function shouldFetchTableKeys (state, database, table) {
  const keys = state.keys;
  if (!keys) return true;
  if (keys.isFetching[database] && keys.isFetching[database][table]) return false;
  if (!keys.keysByTable[database]) return true;
  if (!keys.keysByTable[database][table]) return true;
  return keys.didInvalidate;
}


function fetchTableKeys (database, table, schema) {
  return async dispatch => {
    dispatch({ type: FETCH_KEYS_REQUEST, database, table });
    try {
      const dbConn = getDBConnByName(database);
      const tableKeys = await dbConn.getTableKeys(table, schema);
      dispatch({ type: FETCH_KEYS_SUCCESS, database, table, tableKeys });
    } catch (error) {
      dispatch({ type: FETCH_KEYS_FAILURE, error });
    }
  };
}
