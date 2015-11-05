import * as connTypes from '../actions/connections';
import * as tablesTypes from '../actions/tables';
import * as queriesTypes from '../actions/queries';


const INITIAL_STATE = '';


export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
  case connTypes.CONNECTION_REQUEST:
    return 'Connecting to server...';
  case connTypes.CONNECTION_SUCCESS:
    return 'Connection to server established';
  case tablesTypes.FETCH_TABLES_REQUEST:
    return 'Loading list of tables...';
  case queriesTypes.EXECUTE_QUERY_REQUEST:
    return 'Executing query...';
  default:
    return INITIAL_STATE;
  }
}
