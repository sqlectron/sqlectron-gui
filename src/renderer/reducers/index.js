import { combineReducers } from 'redux';
import databases from './databases';
import servers from './servers';
import query from './query';

const rootReducer = combineReducers({
  databases,
  servers,
  query
});

export default rootReducer;
