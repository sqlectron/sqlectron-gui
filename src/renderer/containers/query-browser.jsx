import { debounce } from 'lodash';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { sqlectron } from '../../browser/remote';
import * as ConnActions from '../actions/connections.js';
import * as QueryActions from '../actions/queries';
import { fetchDatabasesIfNeeded } from '../actions/databases';
import { fetchTablesIfNeeded } from '../actions/tables';
import { fetchViewsIfNeeded } from '../actions/views';
import DatabaseFilter from '../components/database-filter.jsx';
import DatabaseList from '../components/database-list.jsx';
import Header from '../components/header.jsx';
import Footer from '../components/footer.jsx';
import Query from '../components/query.jsx';
import Loader from '../components/loader.jsx';
import MenuHandler from '../menu-handler';


import { ResizableBox } from 'react-resizable';
require('../components/react-resizable.css');
require('../components/react-tabs.scss');


const STYLES = {
  wrapper: {},
  container: { display: 'flex', height: '100vh', boxSizing: 'border-box', padding: '50px 10px 40px 10px' },
  sidebar: { overflowY: 'auto' },
  content: { flex: 1, overflow: 'auto', paddingLeft: '5px' },
  resizeable: { width: 'auto', maxWidth: '100%' },
};


const CLIENTS = sqlectron.db.CLIENTS.reduce((clients, dbClient) => {
  clients[dbClient.key] = { title: dbClient.name };
  return clients;
}, {});


class QueryBrowserContainer extends Component {
  static propTypes = {
    status: PropTypes.string.isRequired,
    databases: PropTypes.object.isRequired,
    tables: PropTypes.object.isRequired,
    views: PropTypes.object.isRequired,
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
    if (error || !isSameServer) dispatch(ConnActions.connect(params.id, params.database));
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
      server,
    } = nextProps;

    if (error || (!connecting && !server)) {
      history.pushState(null, '/');
      return;
    }

    if (!connecting && !isSameServer) {
      dispatch(ConnActions.connect(params.id, params.database));
      return;
    }

    if (!connected) { return; }

    dispatch(fetchDatabasesIfNeeded());
    dispatch(fetchTablesIfNeeded(params.database));
    dispatch(fetchViewsIfNeeded(params.database));

    const table = location.query && location.query.table;
    if (table && !this.state.initialLoadCompleted) {
      dispatch(QueryActions.executeDefaultSelectQueryIfNeeded(table));
    }

    this.setState({ initialLoadCompleted: true });

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
    this.setState({ initialLoadCompleted: false });
  }

  onSelectTable(database, table) {
    if (database.name !== this.props.params.database) {
      this.onSelectDatabase(database, table);
      return;
    }

    this.props.dispatch(QueryActions.executeDefaultSelectQueryIfNeeded(table.name));
  }

  onSQLChange (sqlQuery) {
    this.props.dispatch(QueryActions.updateQuery(sqlQuery));
  }

  onFilterChange (value) {
    this.setState({ filter: value });
  }

  onCloseConnectionClick() {
    const { dispatch } = this.props;
    dispatch(ConnActions.disconnect());
  }

  onReConnectionClick() {
    const { dispatch, params } = this.props;
    dispatch(ConnActions.reconnect(params.id, params.database));
  }

  setMenus() {
    this.menuHandler.setMenus({
      'sqlectron:query-execute': () => {
        const { queries: { queriesById, currentQueryId } } = this.props;
        this.handleExecuteQuery(queriesById[currentQueryId].query);
      },
      'sqlectron:new-tab': () => {
        this.newTab();
      },
    });
  }

  handleSelectTab(index) {
    const queryId = this.props.queries.queryIds[index];
    this.props.dispatch(QueryActions.selectQuery(queryId));
  }

  removeQuery(queryId) {
    this.props.dispatch(QueryActions.removeQuery(queryId));
  }

  copyToClipboard (rows, type) {
    this.props.dispatch(QueryActions.copyToClipboard(rows, type));
  }

  handleExecuteQuery (sqlQuery) {
    this.props.dispatch(QueryActions.executeQueryIfNeeded(sqlQuery));
  }

  filterDatabases(name, databases) {
    const regex = RegExp(name, 'i');
    return databases.filter(db => regex.test(db.name));
  }

  newTab() {
    this.props.dispatch(QueryActions.newQuery(this.props.params.database));
  }

  renderTabQueries() {
    const { server, queries } = this.props;

    const menu = queries.queryIds.map(queryId => {
      const isCurrentQuery = queryId === queries.currentQueryId;
      return (
        <Tab key={queryId} className={`item ${isCurrentQuery ? 'active' : ''}`}>
          {queries.queriesById[queryId].name}
          <button className="right floated ui icon button mini"
            onClick={debounce(() => this.removeQuery(queryId), 200)}>
            <i className="icon remove"></i>
          </button>
        </Tab>
      );
    });

    const panels = queries.queryIds.map(queryId => {
      const query = queries.queriesById[queryId];
      return (
        <TabPanel key={queryId}>
          <Query
            client={server.client}
            query={query}
            onExecQueryClick={::this.handleExecuteQuery}
            onCopyToClipboardClick={::this.copyToClipboard}
            onSQLChange={::this.onSQLChange} />
        </TabPanel>
      );
    });

    const selectedIndex = queries.queryIds.indexOf(queries.currentQueryId);
    return (
      <Tabs onSelect={::this.handleSelectTab} selectedIndex={selectedIndex}>
        <TabList className="ui pointing secondary menu">{menu}</TabList>
        {panels}
      </Tabs>
    );
  }

  render() {
    const { filter } = this.state;
    const {
      status,
      connected,
      server,
      isSameServer,
      databases,
      tables,
      views,
      queries,
    } = this.props;

    const isLoading = (!connected || !isSameServer);
    if (isLoading) {
      return <Loader message={status} type="page" />;
    }

    const { database } = queries.queriesById[queries.currentQueryId];
    const breadcrumb = server ? [
      { icon: 'server', label: server.name },
      { icon: 'database', label: database },
    ] : [];

    const currentClient = CLIENTS[server.client];
    const filteredDatabases = this.filterDatabases(filter, databases.items);

    return (
      <div style={STYLES.wrapper}>
        <div style={STYLES.header}>
          <Header items={breadcrumb}
            onCloseConnectionClick={::this.onCloseConnectionClick}
            onReConnectionClick={::this.onReConnectionClick} />
        </div>
        <div style={STYLES.container}>
          <div style={STYLES.sidebar}>
            <ResizableBox className="react-resizable react-resizable-ew-resize"
              width={235}
              minConstraints={[235, 300]}
              maxConstraints={[750, 10000]}>
              <div className="ui vertical menu" style={STYLES.resizeable}>
                <div className="item active" style={{textAlign: 'center'}}>
                  <b>{currentClient.title}</b>
                </div>
                <div className="item">
                  <DatabaseFilter
                    value={filter}
                    isFetching={databases.isFetching}
                    onFilterChange={::this.onFilterChange} />
                </div>
                <DatabaseList
                  databases={filteredDatabases}
                  isFetching={databases.isFetching}
                  tablesByDatabase={tables.itemsByDatabase}
                  viewsByDatabase={views.viewsByDatabase}
                  onSelectDatabase={::this.onSelectDatabase}
                  onSelectTable={::this.onSelectTable} />
              </div>
            </ResizableBox>
          </div>
          <div style={STYLES.content}>
              {this.renderTabQueries()}
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
  const { connections, databases, tables, views, queries, status } = state;

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
    views,
    queries,
    status,
  };
}


export default connect(mapStateToProps)(QueryBrowserContainer);
