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
import * as connTypes from '../actions/connections';
import * as tablesTypes from '../actions/tables';
import * as queriesTypes from '../actions/queries';


const INITIAL_STATE = '';


export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case connTypes.CONNECTION_REQUEST:
      return 'Connecting to database...';
    case connTypes.CONNECTION_SUCCESS:
      return 'Connection to database established';
    case tablesTypes.FETCH_TABLES_REQUEST:
      return 'Loading list of tables...';
    case queriesTypes.EXECUTE_QUERY_REQUEST:
      return 'Executing query...';
    case queriesTypes.SAVE_QUERY_REQUEST:
      return 'Saving query...';
    case queriesTypes.SAVE_QUERY_SUCCESS:
      return 'Query saved successfully';
    case queriesTypes.SAVE_QUERY_FAILURE:
      return `Error saving query. ${action.error.message}`;
    default:
      return INITIAL_STATE;
  }
}
