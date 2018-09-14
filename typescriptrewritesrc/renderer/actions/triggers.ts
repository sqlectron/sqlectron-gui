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


export const FETCH_TRIGGERS_REQUEST = 'FETCH_TRIGGERS_REQUEST';
export const FETCH_TRIGGERS_SUCCESS = 'FETCH_TRIGGERS_SUCCESS';
export const FETCH_TRIGGERS_FAILURE = 'FETCH_TRIGGERS_FAILURE';


export function fetchTableTriggersIfNeeded (database, table, schema) {
  return (dispatch, getState) => {
    if (shouldFetchTableTriggers(getState(), database, table)) {
      dispatch(fetchTableTriggers(database, table, schema));
    }
  };
}


function shouldFetchTableTriggers (state, database, table) {
  const triggers = state.triggers;
  if (!triggers) return true;
  if (triggers.isFetching) return false;
  if (!triggers.triggersByTable[database]) return true;
  if (!triggers.triggersByTable[database][table]) return true;
  return triggers.didInvalidate;
}


function fetchTableTriggers (database, table, schema) {
  return async dispatch => {
    dispatch({ type: FETCH_TRIGGERS_REQUEST, database, table });
    try {
      const dbConn = getDBConnByName(database);
      const triggers = await dbConn.listTableTriggers(table, schema);
      dispatch({ type: FETCH_TRIGGERS_SUCCESS, database, table, triggers });
    } catch (error) {
      dispatch({ type: FETCH_TRIGGERS_FAILURE, error });
    }
  };
}
