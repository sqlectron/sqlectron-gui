import moment from 'moment';
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as DatabaseActions from '../actions/databases.js';
import ValidatedComponent from 'utils/ValidatedComponent.jsx'
import DatabaseList from '../pages/DatabaseList.jsx';


export default class DatabaseListController extends ValidatedComponent {
  static propTypes = {
    databases: PropTypes.array.isRequired,
    dispatch: PropTypes.func.isRequired
  }

  render() {
    const { databases, dispatch } = this.props;
    const actions = bindActionCreators(DatabaseActions, dispatch);

    return <DatabaseList databases={databases} actions={actions} />;
  }
};


function mapStateToProps(state) {
  return {
    databases: state.databases
  };
}

export default connect(mapStateToProps)(DatabaseListController);
