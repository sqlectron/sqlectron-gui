import { combineReducers } from 'redux';
import databases from './databases';
import connections from './connections';
import query from './query';

const rootReducer = combineReducers({
  databases,
  connections,
  query
});

export default rootReducer;
