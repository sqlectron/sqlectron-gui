import {LODAD_DABATASES} from '../constants/ActionTypes.js';
import {createStore} from 'utils/createStore.js';

export default createStore([], {
  [LODAD_DABATASES]: (state, action) => action.databases
});
