import moment from 'moment';
import _ from 'lodash';
import { LOAD_DATABASES_SUCCESS } from '../constants/action-types';

const initialState = [];

export default function databases(state = initialState, action) {
  switch (action.type) {
  case LOAD_DATABASES_SUCCESS:
    return action.databases;

  default:
    return state;
  }
}
