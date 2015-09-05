import moment from 'moment';

import React, {Component, PropTypes} from 'react';
import ValidatedComponent from 'utils/ValidatedComponent.jsx'

// redux
import { connect, bindActions } from 'redux';
import databases from '../stores/databases.js';
import * as DatabaseActions from '../actions/DatabaseActions.js';

// page
import DatabaseList from '../pages/DatabaseList.jsx';


@connect(state => {
  return {
    databases: state.databases,
  };
})
export default class DatabaseListController extends ValidatedComponent {

  static propTypes = {
    dispatcher: PropTypes.object.isRequired,
    databases: PropTypes.array.isRequired
  }

  render() {
    const {databases, dispatcher} = this.props;
    const actions = bindActions(DatabaseActions, dispatcher);

    const format = 'DD/MM/YYYY'
    const databasesWithDateSorted =
      _.sortBy(databases, p => {
         const date = moment(p['Install Date'], format);
         p['Install Date'] = date;
         return date.unix();
      }).reverse();

    return <DatabaseList databases={databasesWithDateSorted} {...actions} />;
  }

};
