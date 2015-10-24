import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as DatabaseActions from '../actions/databases.js';
// import * as QueryActions from '../actions/query.js';
import DatabaseFilter from '../components/database-filter.jsx';
import DatabaseList from '../components/database-list.jsx';
// import Query from '../components/query.jsx';
import Header from '../components/header.jsx';
import {
  connect as connectDatabase,
  fetchTablesIfNeeded,
  executeQueryIfNeeded,
  fetchDatabasesIfNeeded,
} from '../actions/db';


const STYLES = {
  wrapper: { paddingTop: '50px' },
  container: { display: 'flex' },
  sidebar: { width: '220px' },
  content: { flex: 1 },
};


export default class ConnectionContainer extends Component {
  static propTypes = {
    databases: PropTypes.object.isRequired,
    tables: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    route: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    routeParams: PropTypes.object.isRequired,
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired,
    }),
    children: PropTypes.node,
    connected: PropTypes.bool,
    connecting: PropTypes.bool,
    error: PropTypes.any,
    isSameServer: PropTypes.bool.isRequired,
  };

  static contextTypes = {
    history: PropTypes.object.isRequired,
  };

  componentWillMount () {
    const { dispatch, params, isSameServer, error } = this.props;
    console.info('conn:componentWillMount');
    // console.info('conn:componentWillMount:error', error);
    // console.info('conn:componentWillMount:isSameServer', isSameServer);
    if (error || !isSameServer) dispatch(connectDatabase(params.id, params.database));
    this.handleProps(this.props);
  }

  componentWillReceiveProps (nextProps) {
    console.info('conn:componentWillReceiveProps');
    const { dispatch, params, isSameServer, connecting, connected, error } = nextProps;
    // console.info('conn:componentWillReceiveProps:connecting', connecting);
    // console.info('conn:componentWillReceiveProps:error', error);
    // console.info('conn:componentWillReceiveProps:isSameServer', isSameServer);
    if (!connecting && (error || !isSameServer)) {
      dispatch(connectDatabase(params.id, params.database));
    } else if (connected) {
      this.props.dispatch(fetchDatabasesIfNeeded());
      this.props.dispatch(fetchTablesIfNeeded(params.database));
    }
    this.handleProps(nextProps);
  }

  onSelectDatabase(database) {
    const { params, history } = this.props;
    history.pushState(null, `/server/${params.id}/database/${database.name}`);
  }

  onSelectTable(table) {
    const query = `select * from "${table}" limit 1000`;
    this.props.dispatch(executeQueryIfNeeded(query));
  }

  handleProps (props) {
    // const { dispatch, connected, connecting, error } = props;
    const { connected, connecting, error } = props;

    const setStatus = (status) => this.setState({ status });

    // if (error) dispatch(setStatus(error));
    // if (connecting) dispatch(setStatus('Connecting to server...'));
    // if (connected) dispatch(setStatus('Connection to server established'));
    if (error) setStatus(error);
    if (connecting) setStatus('Connecting to server...');
    if (connected) setStatus('Connection to server established');
  }

  render() {
    // const { databases, query, dispatch } = this.props;
    const { dispatch, params: { database } } = this.props;
    const dbActions = bindActionCreators(DatabaseActions, dispatch);
    // const queryActions = bindActionCreators(QueryActions, dispatch);
    const { children, connected, server, isSameServer, databases, tables } = this.props;
    // console.info('conn:render');
    // console.info('conn:render connected', connected);
    // console.info('conn:render isSameServer', isSameServer);

    const breadcrumb = server ? [
      { icon: 'server', label: server.name },
      { icon: 'database', label: database },
    ] : [];


    const loading = <h1>Loading{this.state && this.state.status}</h1>;
    const isLoading = (!connected || !isSameServer);

    return (
      <div style={STYLES.wrapper}>
        <div style={STYLES.header}>
          <Header items={breadcrumb} includeButtonCloseConn />
        </div>
        {
          isLoading ? loading : <div style={STYLES.container}>
            <div style={STYLES.sidebar}>
              <div className="ui vertical menu">
                <div className="item">
                  <DatabaseFilter actions={dbActions} />
                </div>
                <DatabaseList
                  databases={databases.items}
                  tablesByDatabase={tables && tables.itemsByDatabase}
                  actions={dbActions}
                  onSelectDatabase={::this.onSelectDatabase}
                  onSelectTable={::this.onSelectTable} />
              </div>
            </div>
            <div style={STYLES.content}>
              {children}
            </div>
          </div>
        }
      </div>
    );
  }
}


// function mapStateToProps(state) {
//   return {
//     databases: state.databases,
//     query: state.query,
//   };
// }


function mapStateToProps (state, props) {
  // debugger;
  // console.info('conn:mapStateToProps', state, props);
  const { connection, databases, tables } = state;

  const isSameServer =
    connection
    && connection.server
    && parseInt(props.params.id, 10) === connection.server.id
    && props.params.database === connection.database;

  return { ...connection, isSameServer: !!isSameServer, databases, tables };
}


export default connect(mapStateToProps)(ConnectionContainer);
