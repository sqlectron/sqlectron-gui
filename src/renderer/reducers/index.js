import { combineReducers } from 'redux';
import databases from './databases';
import servers from './servers';
import queries from './queries';
import connections from './connections';
import tables from './tables';


const rootReducer = combineReducers({
  databases,
  servers,
  queries,
  connections,
  tables,
});


export default rootReducer;
