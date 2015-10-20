import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as DatabaseActions from '../actions/databases.js';
import * as QueryActions from '../actions/query.js';
import DatabaseFilter from '../components/database-filter.jsx';
import DatabaseList from '../components/database-list.jsx';
import Query from '../components/query.jsx';
import Header from '../components/header.jsx';


const STYLES = {
  wrapper: { paddingTop: '50px' },
  container: { display: 'flex' },
  sidebar: { width: '220px' },
  content: { flex: 1 },
};


const BREADCRUMB = [
  { icon: 'server', label: 'server-name' },
  { icon: 'database', label: 'database-name' },
];


export default class DatabaseListContainer extends Component {
  static propTypes = {
    databases: PropTypes.array.isRequired,
    query: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    route: PropTypes.object.isRequired,
    routeParams: PropTypes.object.isRequired,
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired,
    }),
    children: PropTypes.node,
  };

  static contextTypes = {
    history: PropTypes.object.isRequired,
  };

  render() {
    const { databases, query, dispatch } = this.props;
    const dbActions = bindActionCreators(DatabaseActions, dispatch);
    const queryActions = bindActionCreators(QueryActions, dispatch);

    return (
      <div style={STYLES.wrapper}>
        <div style={STYLES.header}>
          <Header items={BREADCRUMB} includeButtonCloseConn />
        </div>
        <div style={STYLES.container}>
          <div style={STYLES.sidebar}>
            <div className="ui vertical menu">
              <div className="item">
                <DatabaseFilter actions={dbActions} />
              </div>
              <DatabaseList databases={databases} actions={dbActions} />
            </div>
          </div>
          <div style={STYLES.content}>
            <Query query={query} actions={queryActions} />
          </div>
        </div>
      </div>
    );
  }
}


function mapStateToProps(state) {
  return {
    databases: state.databases,
    query: state.query,
  };
}


export default connect(mapStateToProps)(DatabaseListContainer);
