import {SHOW_DIALOG} from '../constants/ActionTypes.js';
import {createStore} from 'utils/createStore.js';

export default createStore(false, {
  [SHOW_DIALOG]: (state, action) => true
});
