import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import * as DatabaseActions from '../actions/databases.js';
import * as QueryActions from '../actions/query.js';
import DatabaseList from '../components/database-list.jsx';
import Database from '../components/database.jsx';


const STYLES = {
  wrapper: {
  },
  header: {

  },
  container: {
    display: 'flex'
  },
  sidebar: {
    width: '220px'
  },
  content: {
    flex: 1
  }
};


export default class DatabaseListContainer extends Component {
  static propTypes = {
    databases: PropTypes.array.isRequired,
    query: PropTypes.object.isRequired,
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
    const { databases, query, dispatch } = this.props;
    const dbActions = bindActionCreators(DatabaseActions, dispatch);
    const queryActions = bindActionCreators(QueryActions, dispatch);

    return (
      <div style={STYLES.wrapper}>
        <div style={STYLES.header}>
        </div>

        <div className="ui secondary menu">
          <div className="right menu">
            <div className="item">
              <Link to="/" className="ui icon button" title="Close connection">
                <i className="ban icon"></i>
              </Link>
            </div>
          </div>
        </div>

        <div style={STYLES.container}>
          <div style={STYLES.sidebar}>
            <div className="ui vertical menu">
              <div className="item">
                <div className="ui input"><input type="text" placeholder="Search..." /></div>
              </div>
              <DatabaseList databases={databases} actions={dbActions} />
            </div>
          </div>
          <div style={STYLES.content}>
            <Database query={query} actions={queryActions} />
          </div>
        </div>
      </div>
    );
  }
};


function mapStateToProps(state) {
  return {
    databases: state.databases,
    query: state.query
  };
}

export default connect(mapStateToProps)(DatabaseListContainer);
