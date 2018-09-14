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


export const FETCH_SCHEMAS_REQUEST = 'FETCH_SCHEMAS_REQUEST';
export const FETCH_SCHEMAS_SUCCESS = 'FETCH_SCHEMAS_SUCCESS';
export const FETCH_SCHEMAS_FAILURE = 'FETCH_SCHEMAS_FAILURE';

export function fetchSchemasIfNeeded (database) {
  return (dispatch, getState) => {
    if (shouldFetchSchemas(getState(), database)) {
      dispatch(fetchSchemas(database));
    }
  };
}


function shouldFetchSchemas (state, database) {
  const schemas = state.schemas;
  if (!schemas) return true;
  if (schemas.isFetching) return false;
  if (!schemas.itemsByDatabase[database]) return true;
  return schemas.didInvalidate;
}


function fetchSchemas (database) {
  return async (dispatch, getState) => {
    dispatch({ type: FETCH_SCHEMAS_REQUEST, database });
    try {
      const dbConn = getCurrentDBConn(getState());
      const schemas = await dbConn.listSchemas();
      dispatch({ type: FETCH_SCHEMAS_SUCCESS, database, schemas });
    } catch (error) {
      dispatch({ type: FETCH_SCHEMAS_FAILURE, error });
    }
  };
}
