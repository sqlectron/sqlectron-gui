import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { connect as connectDatabase } from '../actions/connections';
import { fetchDatabasesIfNeeded } from '../actions/databases';
import { fetchTablesIfNeeded } from '../actions/tables';
import DatabaseFilter from '../components/database-filter.jsx';
import DatabaseList from '../components/database-list.jsx';
import Header from '../components/header.jsx';
import Footer from '../components/footer.jsx';
import Query from '../components/query.jsx';
import Loader from '../components/loader.jsx';
import MenuHandler from '../menu-handler';
import {
  executeQueryIfNeeded,
  executeDefaultSelectQueryIfNeeded,
  updateQuery,
} from '../actions/queries';


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
    location: PropTypes.shape({ query: PropTypes.object }),
    children: PropTypes.node,
    connected: PropTypes.bool,
    server: PropTypes.object,
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
    this.menuHandler = new MenuHandler();
  }

  componentWillMount () {
    const { dispatch, params, isSameServer, error } = this.props;
    if (error || !isSameServer) dispatch(connectDatabase(params.id, params.database));
  }

  componentDidMount() {
    this.setMenus();
  }

  componentWillReceiveProps (nextProps) {
    const {
      dispatch,
      params,
      location,
      history,
      isSameServer,
      connecting,
      connected,
      error,
    } = nextProps;

    if (error) {
      history.pushState(null, '/');
      return;
    }
    if (!connecting && !isSameServer) {
      dispatch(connectDatabase(params.id, params.database));
      return;
    }
    if (!connected) { return; }

    dispatch(fetchDatabasesIfNeeded());
    dispatch(fetchTablesIfNeeded(params.database));

    const table = location.query && location.query.table;
    if (table) {
      dispatch(executeDefaultSelectQueryIfNeeded(table));
    }

    this.setMenus();
  }

  componentWillUnmount() {
    this.menuHandler.removeAllMenus();
  }

  onSelectDatabase(database, table) {
    const { params, history } = this.props;

    let newStateLocation = `/server/${params.id}/database/${database.name}`;
    if (table) {
      newStateLocation += `?table=${table.name}`;
    }

    history.pushState(null, newStateLocation);
  }

  onSelectTable(database, table) {
    if (database.name !== this.props.params.database) {
      this.onSelectDatabase(database, table);
      return;
    }

    this.props.dispatch(executeDefaultSelectQueryIfNeeded(table.name));
  }

  onSQLChange (sqlQuery) {
    this.props.dispatch(updateQuery(sqlQuery));
  }

  onFilterChange (value) {
    this.setState({ filter: value });
  }

  setMenus() {
    this.menuHandler.setMenus({
      'sqlectron:query-execute': () => {
        this.handleExecuteQuery(this.props.queries.query);
      },
    });
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
    const {
      params: { database },
      status,
      connected,
      server,
      isSameServer,
      databases,
      tables,
      queries,
    } = this.props;

    const isLoading = (!connected || !isSameServer);
    if (isLoading) {
      return <Loader message={status} type="page" />;
    }

    const breadcrumb = server ? [
      { icon: 'server', label: server.name },
      { icon: 'database', label: database },
    ] : [];

    const filteredDatabases = this.filterDatabases(filter, databases.items);

    return (
      <div style={STYLES.wrapper}>
        <div style={STYLES.header}>
          <Header items={breadcrumb} includeButtonCloseConn />
        </div>
        <div style={STYLES.container}>
          <div style={STYLES.sidebar}>
            <div className="ui vertical menu">
              <div className="item">
                <DatabaseFilter onFilterChange={::this.onFilterChange} />
              </div>
              <DatabaseList
                databases={filteredDatabases}
                tablesByDatabase={tables.itemsByDatabase}
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
    && props.params.id === connections.server.id
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
