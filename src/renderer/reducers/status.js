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
