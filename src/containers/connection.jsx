import moment from 'moment';
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import * as DatabaseActions from '../actions/databases.js';
import * as QueryActions from '../actions/query.js';
import ValidatedComponent from 'utils/validated-component.jsx'
import DatabaseList from '../pages/database-list.jsx';
import Database from '../pages/database.jsx';


const STYLES = {
  wrapper: {
  },
  header: {

  },
  container: {
    display: 'flex'
  },
  sidebar: {
    width: '200px'
  },
  content: {
    flex: 1
  }
};


export default class DatabaseListContainer extends ValidatedComponent {
  static propTypes = {
    databases: PropTypes.array.isRequired,
    queryResult: PropTypes.object.isRequired,
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
    const { databases, queryResult, dispatch } = this.props;
    const dbActions = bindActionCreators(DatabaseActions, dispatch);
    const queryActions = bindActionCreators(QueryActions, dispatch);

    return (
      <div style={STYLES.wrapper}>
        <div style={STYLES.header}>
          <Link to="/">Close Connection</Link>
        </div>
        <div style={STYLES.container}>
          <div style={STYLES.sidebar}>
            <DatabaseList databases={databases} actions={dbActions} />
          </div>
          <div style={STYLES.content}>
            <Database queryResult={queryResult} actions={queryActions} />
          </div>
        </div>
      </div>
    );
  }
};


function mapStateToProps(state) {
  return {
    databases: state.databases,
    queryResult: state.queryResult
  };
}

export default connect(mapStateToProps)(DatabaseListContainer);
