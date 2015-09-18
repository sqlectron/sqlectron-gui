import { combineReducers } from 'redux';
import dialog from './dialog';
import databases from './databases';
import connections from './connections';
import query from './query';

const rootReducer = combineReducers({
  dialog,
  databases,
  connections,
  query
});

export default rootReducer;
