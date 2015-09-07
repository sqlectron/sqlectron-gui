import moment from 'moment';
import _ from 'lodash';
import { LODAD_DABATASES } from '../constants/ActionTypes';

const initialState = [];

const format = 'DD/MM/YYYY'

export default function todos(state = initialState, action) {
  switch (action.type) {
  case LODAD_DABATASES:
    return _.sortBy(action.databases, p => {
       const date = moment(p['Install Date'], format);
       p['Install Date'] = date;
       return date.unix();
    }).reverse();

  default:
    return state;
  }
}
