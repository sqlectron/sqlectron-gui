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
import Footer from '../components/footer.jsx';
import Query from '../components/query.jsx';


const STYLES = {
  wrapper: { paddingTop: '50px' },
  container: { display: 'flex' },
  sidebar: { width: '220px' },
  content: { flex: 1 },
};


export default class QueryBrowserContainer extends Component {
  static propTypes = {
    status: PropTypes.string.isRequired,
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

  constructor(props, context) {
    super(props, context);
    this.state = {};
  }

  componentWillMount () {
    const { dispatch, params, isSameServer, error } = this.props;
    if (error || !isSameServer) dispatch(connectDatabase(params.id, params.database));
  }

  componentWillReceiveProps (nextProps) {
    const { dispatch, params, isSameServer, connecting, connected, error } = nextProps;
    if (!connecting && (error || !isSameServer)) {
      dispatch(connectDatabase(params.id, params.database));
    } else if (connected) {
      this.props.dispatch(fetchDatabasesIfNeeded());
      this.props.dispatch(fetchTablesIfNeeded(params.database));
    }
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

  onFilterChange (value) {
    this.setState({ filter: value });
  }

  handleExecuteQuery (sqlQuery) {
    this.props.dispatch(executeQueryIfNeeded(sqlQuery));
  }

  filterDatabases(name, databases) {
    const regex = RegExp(name, 'i');
    return databases.filter(db => regex.test(db.name));
  }

  render() {
    const { filter } = this.state;
    const dbActions = bindActionCreators(DatabaseActions, dispatch);
    const {
      dispatch,
      params: { database },
      status,
      connected,
      server,
      isSameServer,
      databases,
      tables,
      queries,
    } = this.props;

    const breadcrumb = server ? [
      { icon: 'server', label: server.name },
      { icon: 'database', label: database },
    ] : [];

    const loading = <h1>Loading{this.state && this.state.status}</h1>;
    const isLoading = (!connected || !isSameServer);

    const filteredDatabases = this.filterDatabases(filter, databases.items);

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
                  <DatabaseFilter onFilterChange={::this.onFilterChange} />
                </div>
                <DatabaseList
                  databases={filteredDatabases}
                  tablesByDatabase={tables.itemsByDatabase}
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
        <div style={STYLES.footer}>
          <Footer status={status} />
        </div>
      </div>
    );
  }
}


function mapStateToProps (state, props) {
  const { connections, databases, tables, queries, status } = state;

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
    status,
  };
}


export default connect(mapStateToProps)(QueryBrowserContainer);
