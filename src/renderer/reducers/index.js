import { combineReducers } from 'redux';
import databases from './databases';
import servers from './servers';
import query from './query';
import connection from './connection';
import tables from './tables';


const rootReducer = combineReducers({
  databases,
  servers,
  query,
  connection,
  tables,
});


export default rootReducer;
