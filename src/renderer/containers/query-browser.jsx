import { debounce, union } from 'lodash';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { sqlectron } from '../../browser/remote';
import * as ConnActions from '../actions/connections.js';
import * as QueryActions from '../actions/queries';
import * as DbAction from '../actions/databases';
import { fetchTablesIfNeeded, selectTablesForDiagram } from '../actions/tables';
import { fetchTableColumnsIfNeeded } from '../actions/columns';
import { fetchTableTriggersIfNeeded } from '../actions/triggers';
import { fetchViewsIfNeeded } from '../actions/views';
import { fetchRoutinesIfNeeded } from '../actions/routines';
import { getSQLScriptIfNeeded } from '../actions/sqlscripts';
import { fetchTableKeysIfNeeded } from '../actions/keys';
import DatabaseFilter from '../components/database-filter.jsx';
import DatabaseList from '../components/database-list.jsx';
import DatabaseDiagramModal from '../components/database-diagram-modal.jsx';
import Header from '../components/header.jsx';
import Footer from '../components/footer.jsx';
import Query from '../components/query.jsx';
import Loader from '../components/loader.jsx';
import PromptModal from '../components/prompt-modal.jsx';
import MenuHandler from '../menu-handler';


import { ResizableBox } from 'react-resizable';
require('../components/react-resizable.css');
require('../components/react-tabs.scss');

const SIDEBAR_WIDTH = 235;
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
    connections: PropTypes.object.isRequired,
    status: PropTypes.string.isRequired,
    databases: PropTypes.object.isRequired,
    tables: PropTypes.object.isRequired,
    columns: PropTypes.object.isRequired,
    triggers: PropTypes.object.isRequired,
    views: PropTypes.object.isRequired,
    routines: PropTypes.object.isRequired,
    queries: PropTypes.object.isRequired,
    sqlscripts: PropTypes.object.isRequired,
    keys: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    route: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    location: PropTypes.shape({ query: PropTypes.object }),
    children: PropTypes.node,
  };

  static contextTypes = {
    history: PropTypes.object.isRequired,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      sideBarWidth: SIDEBAR_WIDTH,
    };
    this.menuHandler = new MenuHandler();
  }

  componentWillMount () {
    const { dispatch, params } = this.props;
    dispatch(ConnActions.connect(params.id));
  }

  componentDidMount() {
    this.setMenus();
  }

  componentWillReceiveProps (nextProps) {
    const { dispatch, history, connections } = nextProps;

    if (connections.error || (!connections.connecting && !connections.server && !connections.waitingSSHPassword)) {
      history.pushState(null, '/');
      return;
    }

    if (!connections.connected) {
      return;
    }

    const lastConnectedDB = connections.databases[connections.databases.length - 1];

    dispatch(DbAction.fetchDatabasesIfNeeded());
    dispatch(fetchTablesIfNeeded(lastConnectedDB));
    dispatch(fetchViewsIfNeeded(lastConnectedDB));
    dispatch(fetchRoutinesIfNeeded(lastConnectedDB));

    this.setMenus();
  }

  componentWillUnmount() {
    this.menuHandler.removeAllMenus();
  }

  onSelectDatabase(database) {
    const { dispatch, params } = this.props;

    dispatch(ConnActions.connect(params.id, database.name));
  }

  onExecuteDefaultQuery(database, table) {
    this.props.dispatch(QueryActions.executeDefaultSelectQueryIfNeeded(database.name, table.name));
  }

  onPromptCancelClick() {
    const { dispatch } = this.props;
    dispatch(ConnActions.disconnect());
  }

  onPromptOKClick(password) {
    const { dispatch, params } = this.props;
    dispatch(ConnActions.connect(params.id, null, false, password));
  }

  onSelectTable(database, table) {
    this.props.dispatch(fetchTableColumnsIfNeeded(database.name, table.name));
    this.props.dispatch(fetchTableTriggersIfNeeded(database.name, table.name));
  }

  onGetSQLScript(database, item, actionType, objectType) {
    this.props.dispatch(getSQLScriptIfNeeded(database.name, item.name, actionType, objectType));
  }

  onSQLChange (sqlQuery) {
    this.props.dispatch(QueryActions.updateQueryIfNeeded(sqlQuery));
  }

  onQuerySelectionChange (sqlQuery, selectedQuery) {
    this.props.dispatch(QueryActions.updateQueryIfNeeded(sqlQuery, selectedQuery));
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
    dispatch(ConnActions.reconnect(params.id, this.getCurrentQuery().database));
  }

  onRefreshDatabase(database) {
    const { dispatch } = this.props;
    dispatch(DbAction.refreshDatabase(database));
  }

  onShowDiagramModal(database) {
    const { dispatch } = this.props;
    dispatch(DbAction.showDatabaseDiagram(database.name));
  }

  onGenerateDatabaseDiagram(database) {
    const { dispatch } = this.props;
    const selectedTables = [];

    dispatch(DbAction.generateDatabaseDiagram());

    $(':checkbox:checked', 'div.ui.list').map((index, checkbox) => {
      selectedTables.push(checkbox.id);
    });

    dispatch(selectTablesForDiagram(selectedTables));
    this.fetchTableDiagramData(database, selectedTables);
  }

  onAddRelatedTables(relatedTables) {
    const { dispatch, databases, tables } = this.props;
    const database = databases.diagramDatabase;
    const tablesOnDiagram = tables.selectedTablesForDiagram;
    const selectedTables = union(tablesOnDiagram, relatedTables);

    dispatch(selectTablesForDiagram(selectedTables));
    this.fetchTableDiagramData(database, relatedTables);
  }

  fetchTableDiagramData(database, tables) {
    const { dispatch } = this.props;
    tables.map((item) => {
      dispatch(fetchTableColumnsIfNeeded(database, item));
      dispatch(fetchTableKeysIfNeeded(database, item));
    });
  }

  onSaveDatabaseDiagram(diagram) {
    this.props.dispatch(DbAction.saveDatabaseDiagram(diagram));
  }

  onExportDatabaseDiagram(diagram, imageType) {
    this.props.dispatch(DbAction.exportDatabaseDiagram(diagram, imageType));
  }

  onOpenDatabaseDiagram() {
    this.props.dispatch(DbAction.openDatabaseDiagram());
  }

  onCloseDiagramModal() {
    this.props.dispatch(DbAction.closeDatabaseDiagram());
  }

  getCurrentQuery() {
    return this.props.queries.queriesById[this.props.queries.currentQueryId];
  }

  setMenus() {
    this.menuHandler.setMenus({
      'sqlectron:query-execute': () => {
        const { queries: { queriesById, currentQueryId } } = this.props;
        const currentQuery = queriesById[currentQueryId];
        this.handleExecuteQuery(currentQuery.selectedQuery || currentQuery.query);
      },
      'sqlectron:new-tab': () => this.newTab(),
      'sqlectron:close-tab': () => this.closeTab(),
      'sqlectron:save-query': () => this.saveQuery(),
      'sqlectron:query-focus': () => this.focusQuery(),
      'sqlectron:toggle-database-search': () => this.toggleDatabaseSearch(),
      'sqlectron:toggle-database-objects-search': () => this.toggleDatabaseObjectsSearch(),
    });
  }

  handleSelectTab(index) {
    const queryId = this.props.queries.queryIds[index];
    this.props.dispatch(QueryActions.selectQuery(queryId));
  }

  removeQuery(queryId) {
    this.props.dispatch(QueryActions.removeQuery(queryId));
  }

  saveQuery() {
    this.props.dispatch(QueryActions.saveQuery());
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

  focusQuery() {
    const currentQuery = this.getCurrentQuery();
    if (!currentQuery) {
      return;
    }

    this.refs[`queryBox_${currentQuery.id}`].focus();
  }

  toggleDatabaseSearch() {
    this.refs.databaseFilter.focus();
  }

  toggleDatabaseObjectsSearch() {
    const currentDB = this.getCurrentQuery().database;
    if (!currentDB) {
      return;
    }

    this.refs.databaseList.focus(currentDB);
  }

  newTab() {
    this.props.dispatch(QueryActions.newQuery(this.getCurrentQuery().database));
  }

  closeTab() {
    this.removeQuery(this.props.queries.currentQueryId);
  }

  renderDatabaseDiagramModal() {
    const {
      databases,
      tables,
      columns,
      views,
      keys,
    } = this.props;

    const selectedDB = databases.diagramDatabase;

    return (
      <DatabaseDiagramModal
        database={selectedDB}
        tables={tables.itemsByDatabase[selectedDB]}
        selectedTables={tables.selectedTablesForDiagram}
        views={views.viewsByDatabase[selectedDB]}
        columnsByTable={columns.columnsByTable[selectedDB]}
        tableKeys={keys.keysByTable[selectedDB]}
        diagramJSON={databases.diagramJSON}
        isSaving={databases.isSaving}
        onGenerateDatabaseDiagram={::this.onGenerateDatabaseDiagram}
        addRelatedTables={::this.onAddRelatedTables}
        onSaveDatabaseDiagram={::this.onSaveDatabaseDiagram}
        onExportDatabaseDiagram={::this.onExportDatabaseDiagram}
        onOpenDatabaseDiagram={::this.onOpenDatabaseDiagram}
        onClose={::this.onCloseDiagramModal} />
    );
  }

  renderTabQueries() {
    const {
      connections,
      queries,
      databases,
      tables,
      columns,
      triggers,
      views,
      routines,
    } = this.props;

    const currentDB = this.getCurrentQuery().database;

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
            ref={`queryBox_${queryId}`}
            client={connections.server.client}
            query={query}
            enabledAutoComplete={queries.enabledAutoComplete}
            enabledLiveAutoComplete={queries.enabledLiveAutoComplete}
            database={currentDB}
            databases={databases.items}
            tables={tables.itemsByDatabase[query.database]}
            columnsByTable={columns.columnsByTable[query.database]}
            triggersByTable={triggers.triggersByTable[query.database]}
            views={views.viewsByDatabase[query.database]}
            functions={routines.functionsByDatabase[query.database]}
            procedures={routines.proceduresByDatabase[query.database]}
            widthOffset={this.state.sideBarWidth}
            onExecQueryClick={::this.handleExecuteQuery}
            onCopyToClipboardClick={::this.copyToClipboard}
            onSQLChange={::this.onSQLChange}
            onSelectionChange={::this.onQuerySelectionChange} />
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
      connections,
      databases,
      tables,
      columns,
      triggers,
      views,
      routines,
    } = this.props;

    if (connections.waitingPrivateKeyPassphrase) {
      return (
        <PromptModal
          type="password"
          title={`SSH Private Key Passphrase`}
          message="Enter the private key passphrase:"
          onCancelClick={::this.onPromptCancelClick}
          onOKClick={::this.onPromptOKClick} />
      );
    }

    const isLoading = (!connections.connected);
    if (isLoading && (!connections.server || !this.getCurrentQuery())) {
      return <Loader message={status} type="page" />;
    }

    const breadcrumb = connections.server ? [
      { icon: 'server', label: connections.server.name },
      { icon: 'database', label: this.getCurrentQuery().database },
    ] : [];

    const currentClient = CLIENTS[connections.server.client];
    const filteredDatabases = this.filterDatabases(filter, databases.items);

    return (
      <div style={STYLES.wrapper}>
        { isLoading && <Loader message={status} type="page" />}
        <div style={STYLES.header}>
          <Header items={breadcrumb}
            onCloseConnectionClick={::this.onCloseConnectionClick}
            onReConnectionClick={::this.onReConnectionClick} />
        </div>
        <div style={STYLES.container}>
          <div style={STYLES.sidebar}>
            <ResizableBox className="react-resizable react-resizable-ew-resize"
              onResizeStop={(event, { size }) => this.setState({ sideBarWidth: size.width })}
              width={SIDEBAR_WIDTH}
              height={NaN}
              minConstraints={[SIDEBAR_WIDTH, 300]}
              maxConstraints={[750, 10000]}>
              <div className="ui vertical menu" style={STYLES.resizeable}>
                <div className="item active" style={{textAlign: 'center'}}>
                  <b>{currentClient.title}</b>
                </div>
                <div className="item">
                  <DatabaseFilter
                    ref="databaseFilter"
                    value={filter}
                    isFetching={databases.isFetching}
                    onFilterChange={::this.onFilterChange} />
                </div>
                <DatabaseList
                  ref="databaseList"
                  databases={filteredDatabases}
                  isFetching={databases.isFetching}
                  tablesByDatabase={tables.itemsByDatabase}
                  columnsByTable={columns.columnsByTable}
                  triggersByTable={triggers.triggersByTable}
                  viewsByDatabase={views.viewsByDatabase}
                  functionsByDatabase={routines.functionsByDatabase}
                  proceduresByDatabase={routines.proceduresByDatabase}
                  onSelectDatabase={::this.onSelectDatabase}
                  onExecuteDefaultQuery={::this.onExecuteDefaultQuery}
                  onSelectTable={::this.onSelectTable}
                  onGetSQLScript={::this.onGetSQLScript}
                  onRefreshDatabase={::this.onRefreshDatabase}
                  onShowDiagramModal={::this.onShowDiagramModal} />
              </div>
            </ResizableBox>
          </div>
          <div style={STYLES.content}>
              {this.renderTabQueries()}
          </div>
          {this.props.databases.showingDiagram && this.renderDatabaseDiagramModal()}
        </div>
        <div style={STYLES.footer}>
          <Footer status={status} />
        </div>
      </div>
    );
  }
}


function mapStateToProps (state) {
  const {
    connections,
    databases,
    tables,
    columns,
    triggers,
    views,
    routines,
    queries,
    sqlscripts,
    keys,
    status,
  } = state;

  return {
    connections,
    databases,
    tables,
    columns,
    triggers,
    views,
    routines,
    queries,
    sqlscripts,
    keys,
    status,
  };
}


export default connect(mapStateToProps)(QueryBrowserContainer);
