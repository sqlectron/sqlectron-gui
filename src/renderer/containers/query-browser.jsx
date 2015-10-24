import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { connect as connectDatabase } from '../actions/connections';
import { fetchDatabasesIfNeeded } from '../actions/databases';
import { fetchTablesIfNeeded } from '../actions/tables';
import { executeQueryIfNeeded, updateQuery } from '../actions/queries';
import * as DatabaseActions from '../actions/databases.js';
import DatabaseFilter from '../components/database-filter.jsx';
import DatabaseList from '../components/database-list.jsx';
import Header from '../components/header.jsx';
import Query from '../components/query.jsx';


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
    queries: PropTypes.object.isRequired,
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
    this.handleEvents(this.props);
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
    this.handleEvents(this.props);
  }

  onSelectDatabase(database) {
    const { params, history } = this.props;
    history.pushState(null, `/server/${params.id}/database/${database.name}`);
  }

  onSelectTable(table) {
    const query = `select * from "${table}" limit 1000`;
    this.props.dispatch(executeQueryIfNeeded(query));
  }

  onSQLChange (sqlQuery) {
    this.props.dispatch(updateQuery(sqlQuery));
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

  handleEvents (/* { tables, query } */) {
    // const { dispatch } = this.props;
    //
    // if (tables.error) return dispatch(setStatus(tables.error));
    // if (tables.isFetching) return dispatch(setStatus('Loading list of tables...'));
    // if (query.isExecuting) return dispatch(setStatus('Executing query...'));
    // if (query.error) return dispatch(setStatus(query.error));
    //
    // dispatch(clearStatus());
  }

  handleExecuteQuery (sqlQuery) {
    this.props.dispatch(executeQueryIfNeeded(sqlQuery));
  }

  render() {
    const { dispatch, params: { database } } = this.props;
    const dbActions = bindActionCreators(DatabaseActions, dispatch);
    const { children, connected, server, isSameServer, databases, tables, queries } = this.props;

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
              <Query query={queries}
                onExecQueryClick={::this.handleExecuteQuery}
                onSQLChange={::this.onSQLChange} />
            </div>
          </div>
        }
      </div>
    );
  }
}


function mapStateToProps (state, props) {
  // console.info('conn:mapStateToProps', state, props);
  const { connections, databases, tables, queries } = state;

  const isSameServer =
    connections
    && connections.server
    && parseInt(props.params.id, 10) === connections.server.id
    && props.params.database === connections.database;

  return {
    ...connections,
    isSameServer: !!isSameServer,
    databases,
    tables,
    queries,
  };
}


export default connect(mapStateToProps)(ConnectionContainer);
