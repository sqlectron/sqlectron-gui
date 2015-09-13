import moment from 'moment';
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import * as DatabaseActions from '../actions/databases.js';
import ValidatedComponent from 'utils/validated-component.jsx'
import DatabaseList from '../pages/database-list.jsx';


export default class DatabaseListContainer extends ValidatedComponent {
  static propTypes = {
    databases: PropTypes.array.isRequired,
    dispatch: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    route: PropTypes.object.isRequired,
    routeParams: PropTypes.object.isRequired,
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired
    }),
    params: PropTypes.shape({
      userLogin: PropTypes.string,
      repoName: PropTypes.string
    }).isRequired,
    children: PropTypes.node
  }

  static contextTypes = {
    history: PropTypes.object.isRequired
  }

  render() {
    const { databases, dispatch } = this.props;
    const actions = bindActionCreators(DatabaseActions, dispatch);

    return (
      <div>
        <Link to="/">Close Connection</Link>
        <DatabaseList databases={databases} actions={actions} />;
      </div>
    );
  }
};


function mapStateToProps(state) {
  return {
    databases: state.databases
  };
}

export default connect(mapStateToProps)(DatabaseListContainer);
