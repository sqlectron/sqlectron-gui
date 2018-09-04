import debounce from 'lodash.debounce';
import union from 'lodash.union';
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { ResizableBox } from 'react-resizable';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { sqlectron } from '../../browser/remote';
import * as ConnActions from '../actions/connections.js';
import * as QueryActions from '../actions/queries';
import * as DbAction from '../actions/databases';
import { fetchTablesIfNeeded, selectTablesForDiagram } from '../actions/tables';
import { fetchSchemasIfNeeded } from '../actions/schemas';
import { fetchTableColumnsIfNeeded } from '../actions/columns';
import { fetchTableTriggersIfNeeded } from '../actions/triggers';
import { fetchTableIndexesIfNeeded } from '../actions/indexes';
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
import { requireLogos } from '../components/require-context';


require('./query-browser.css');
require('../components/react-resizable.css');
require('../components/react-tabs.scss');

const SIDEBAR_WIDTH = 235;
const STYLES = {
  wrapper: {},
  container: {
    display: 'flex',
    height: '100vh',
    boxSizing: 'border-box',
    padding: '50px 10px 40px 10px',
  },
  sidebar: { transition: 'all .2s' },
  content: { flex: 1, overflow: 'auto', paddingLeft: '5px' },
  collapse: {
    position: 'fixed',
    color: '#fff',
    cursor: 'pointer',
    width: 10,
    left: 0,
    height: '100vh',
    backgroundColor: 'rgb(102,102,102)',
    zIndex: 1,
    MozUserSelect: 'none',
    WebkitUserSelect: 'none',
    msUserSelect: 'none',
  },
  resizeable: { width: 'auto', maxWidth: '100%' },
};


const CLIENTS = sqlectron.db.CLIENTS.reduce((clients, dbClient) => {
  /* eslint no-param-reassign:0 */
  clients[dbClient.key] = {
    title: dbClient.name,
    image: requireLogos(`./server-db-client-${dbClient.key}.png`),
  };
  return clients;
}, {});


class QueryBrowserContainer extends Component {
  static propTypes = {
    config: PropTypes.object.isRequired,
    connections: PropTypes.object.isRequired,
    status: PropTypes.string.isRequired,
    databases: PropTypes.object.isRequired,
    schemas: PropTypes.object.isRequired,
    tables: PropTypes.object.isRequired,
    columns: PropTypes.object.isRequired,
    triggers: PropTypes.object.isRequired,
    indexes: PropTypes.object.isRequired,
    views: PropTypes.object.isRequired,
    routines: PropTypes.object.isRequired,
    queries: PropTypes.object.isRequired,
    sqlscripts: PropTypes.object.isRequired,
    keys: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    router: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    children: PropTypes.node,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      tabNavPosition: 0,
      sideBarWidth: SIDEBAR_WIDTH,
      sidebarCollapsed: false,
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
    const { dispatch, router, connections } = nextProps;

    if (connections.error ||
       (!connections.connecting && !connections.server && !connections.waitingSSHPassword)
    ) {
      router.push('/');
      return;
    }

    if (!connections.connected) {
      return;
    }

    const lastConnectedDB = connections.databases[connections.databases.length - 1];
    const filter = connections.server.filter;

    dispatch(DbAction.fetchDatabasesIfNeeded(filter));
    dispatch(fetchSchemasIfNeeded(lastConnectedDB));
    dispatch(fetchTablesIfNeeded(lastConnectedDB, filter));
    dispatch(fetchViewsIfNeeded(lastConnectedDB, filter));
    dispatch(fetchRoutinesIfNeeded(lastConnectedDB, filter));

    this.setMenus();
  }

  componentDidUpdate() {
    const elem = ReactDOM.findDOMNode(this.refs.tabList);
    if (!elem) {
      return;
    }

    this.tabListTotalWidth = elem.offsetWidth;
    this.tabListTotalWidthChildren = 0;
    for (const child of elem.children) {
      this.tabListTotalWidthChildren += child.offsetWidth;
    }
  }

  componentWillUnmount() {
    this.menuHandler.removeAllMenus();
  }

  onSelectDatabase(database) {
    const { dispatch, params } = this.props;

    dispatch(ConnActions.connect(params.id, database.name));
  }

  onExecuteDefaultQuery(database, table) {
    const schema = table.schema || this.props.connections.server.schema;
    this.props.dispatch(
      QueryActions.executeDefaultSelectQueryIfNeeded(database.name, table.name, schema)
    );
  }

  onCollapseClick() {
    this.setState({ sidebarCollapsed: !this.state.sidebarCollapsed });
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
    const schema = table.schema || this.props.connections.server.schema;
    this.props.dispatch(fetchTableColumnsIfNeeded(database.name, table.name, schema));
    this.props.dispatch(fetchTableTriggersIfNeeded(database.name, table.name, schema));
    this.props.dispatch(fetchTableIndexesIfNeeded(database.name, table.name, schema));
  }

  onGetSQLScript(database, item, actionType, objectType) {
    const schema = item.schema || this.props.connections.server.schema;
    this.props.dispatch(
      getSQLScriptIfNeeded(database.name, item.name, actionType, objectType, schema)
    );
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

    $(':checkbox:checked', 'div.ui.list')
      .map((index, checkbox) => selectedTables.push(checkbox.id));

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

  onTabDoubleClick(queryId) {
    this.setState({ renamingTabQueryId: queryId });
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
      'sqlectron:open-query': () => this.openQuery(),
      'sqlectron:query-focus': () => this.focusQuery(),
      'sqlectron:toggle-database-search': () => this.toggleDatabaseSearch(),
      'sqlectron:toggle-database-objects-search': () => this.toggleDatabaseObjectsSearch(),
    });
  }

  fetchTableDiagramData(database, tables) {
    const { dispatch, connections } = this.props;
    tables.forEach((item) => {
      const schema = item.schema || connections.server.schema;
      dispatch(fetchTableColumnsIfNeeded(database, item, schema));
      dispatch(fetchTableKeysIfNeeded(database, item, schema));
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

  openQuery() {
    this.props.dispatch(QueryActions.openQuery());
  }

  copyToClipboard (rows, type, delimiter) {
    this.props.dispatch(QueryActions.copyToClipboard(rows, type, delimiter));
  }

  saveToFile (rows, type, delimiter) {
    this.props.dispatch(QueryActions.saveToFile(rows, type, delimiter));
  }

  handleExecuteQuery (sqlQuery) {
    const currentQuery = this.getCurrentQuery();
    if (!currentQuery) {
      return;
    }

    this.props.dispatch(QueryActions.executeQueryIfNeeded(sqlQuery, currentQuery.id));
  }

  handleCancelQuery () {
    const currentQuery = this.getCurrentQuery();
    if (!currentQuery) {
      return;
    }

    this.props.dispatch(QueryActions.cancelQuery(currentQuery.id));
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
      dispatch,
      connections,
      queries,
      databases,
      schemas,
      tables,
      columns,
      triggers,
      indexes,
      views,
      routines,
    } = this.props;

    const currentDB = this.getCurrentQuery().database;


    const menu = queries.queryIds.map(queryId => {
      const isCurrentQuery = queryId === queries.currentQueryId;
      const buildContent = () => {
        const isRenaming = this.state.renamingTabQueryId === queryId;
        if (isRenaming) {
          return (
            <div className="ui input">
              <input
                autoFocus
                type="text"
                ref={(comp) => { this.tabInput = comp; }}
                onBlur={() => {
                  dispatch(QueryActions.renameQuery(this.tabInput.value));
                  this.setState({ renamingTabQueryId: null });
                }}
                onKeyDown={(event) => {
                  if (event.key !== 'Escape' && event.key !== 'Enter') {
                    return;
                  }

                  if (event.key === 'Enter') {
                    dispatch(QueryActions.renameQuery(this.tabInput.value));
                  }

                  this.setState({ renamingTabQueryId: null });
                }}
                defaultValue={queries.queriesById[queryId].name} />
            </div>
          );
        }

        return (
          <div>
            {queries.queriesById[queryId].name}
            <button className="right floated ui icon button mini"
              onClick={debounce(() => {
                this.removeQuery(queryId);
                const position = this.state.tabNavPosition + 200;
                this.setState({ tabNavPosition: position > 0 ? 0 : position });
              }, 200)}>
              <i className="icon remove"></i>
            </button>
          </div>
        );
      };

      return (
        <Tab key={queryId}
          onDoubleClick={() => this.onTabDoubleClick(queryId)}
          className={`item ${isCurrentQuery ? 'active' : ''}`}>
          {buildContent()}
        </Tab>
      );
    });

    const { disabledFeatures } = sqlectron.db.CLIENTS
      .find(dbClient => dbClient.key === connections.server.client);

    const allowCancel = !disabledFeatures || !~disabledFeatures.indexOf('cancelQuery');

    const panels = queries.queryIds.map(queryId => {
      const query = queries.queriesById[queryId];

      return (
        <TabPanel key={queryId}>
          <Query
            ref={`queryBox_${queryId}`}
            editorName={`querybox${queryId}`}
            config={this.props.config}
            client={connections.server.client}
            allowCancel={allowCancel}
            query={query}
            enabledAutoComplete={queries.enabledAutoComplete}
            enabledLiveAutoComplete={queries.enabledLiveAutoComplete}
            database={currentDB}
            databases={databases.items}
            schemas={schemas.itemsByDatabase[query.database]}
            tables={tables.itemsByDatabase[query.database]}
            columnsByTable={columns.columnsByTable[query.database]}
            triggersByTable={triggers.triggersByTable[query.database]}
            indexesByTable={indexes.indexesByTable[query.database]}
            views={views.viewsByDatabase[query.database]}
            functions={routines.functionsByDatabase[query.database]}
            procedures={routines.proceduresByDatabase[query.database]}
            widthOffset={this.state.sideBarWidth}
            onExecQueryClick={::this.handleExecuteQuery}
            onCancelQueryClick={::this.handleCancelQuery}
            onCopyToClipboardClick={::this.copyToClipboard}
            onSaveToFileClick={::this.saveToFile}
            onSQLChange={::this.onSQLChange}
            onSelectionChange={::this.onQuerySelectionChange} />
        </TabPanel>
      );
    });

    const isOnMaxPosition = (
      this.tabListTotalWidthChildren - Math.abs(this.state.tabNavPosition) <= this.tabListTotalWidth
    );
    const selectedIndex = queries.queryIds.indexOf(queries.currentQueryId);
    const isTabsFitOnScreen = this.tabListTotalWidthChildren >= this.tabListTotalWidth;
    return (
      <Tabs onSelect={::this.handleSelectTab} selectedIndex={selectedIndex} forceRenderTabPanel>
        <div id="tabs-nav-wrapper" className="ui pointing secondary menu">
          {isTabsFitOnScreen &&
            <button className="ui icon button"
              disabled={this.state.tabNavPosition === 0}
              onClick={() => {
                const position = this.state.tabNavPosition + 100;
                this.setState({ tabNavPosition: position > 0 ? 0 : position });
              }}>
              <i className="left chevron icon"></i>
            </button>
          }
          <div className="tabs-container">
            <TabList
              ref="tabList"
              style={{ left: `${this.state.tabNavPosition}px`, transition: 'left 0.2s linear' }}>
              {menu}
            </TabList>
          </div>
          <button className="ui basic icon button" onClick={() => this.newTab()}>
            <i className="plus icon"></i>
          </button>
          {isTabsFitOnScreen &&
            <button className="ui icon button"
              disabled={this.tabListTotalWidthChildren < this.tabListTotalWidth || isOnMaxPosition}
              onClick={() => {
                const position = this.state.tabNavPosition - 100;
                this.setState({ tabNavPosition: position });
              }}>
              <i className="right chevron icon"></i>
            </button>
          }
        </div>
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
      schemas,
      tables,
      columns,
      triggers,
      indexes,
      views,
      routines,
    } = this.props;
    const currentDB = this.getCurrentQuery() ? this.getCurrentQuery().database : null;

    if (connections.waitingPrivateKeyPassphrase) {
      return (
        <PromptModal
          type="password"
          title={'SSH Private Key Passphrase'}
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

    const filteredDatabases = this.filterDatabases(filter, databases.items);
    return (
      <div style={STYLES.wrapper}>
        {isLoading && <Loader message={status} type="page" />}
        <div style={STYLES.header}>
          <Header items={breadcrumb}
            onCloseConnectionClick={::this.onCloseConnectionClick}
            onReConnectionClick={::this.onReConnectionClick} />
        </div>
        <div onClick={::this.onCollapseClick} style={STYLES.collapse}>
          <i
            className={`${this.state.sidebarCollapsed ? 'right' : 'left'} triangle icon`}
            style={{ top: 'calc(100vh/2 - 7px)', position: 'absolute', marginLeft: -3 }}
          />
        </div>
        <div style={STYLES.container}>
          <div id="sidebar" style={{
            ...STYLES.sidebar,
            marginLeft: this.state.sidebarCollapsed ? (- this.state.sideBarWidth) : 0,
          }}>
            <ResizableBox className="react-resizable react-resizable-ew-resize"
              onResizeStop={(event, { size }) => this.setState({ sideBarWidth: size.width })}
              width={this.state.sideBarWidth || SIDEBAR_WIDTH}
              height={NaN}
              minConstraints={[SIDEBAR_WIDTH, 300]}
              maxConstraints={[750, 10000]}>
              <div className="ui vertical menu" style={STYLES.resizeable}>
                <div className="item active" style={{ textAlign: 'center' }}>
                  <b>{connections.server.name}</b>
                  <img
                    title={CLIENTS[connections.server.client].name}
                    alt={CLIENTS[connections.server.client].name} style={{ width: '2.5em' }}
                    className="ui mini left spaced image right"
                    src={CLIENTS[connections.server.client].image} />
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
                  client={connections.server.client}
                  databases={filteredDatabases}
                  currentDB={currentDB}
                  isFetching={databases.isFetching}
                  schemasByDatabase={schemas.itemsByDatabase}
                  tablesByDatabase={tables.itemsByDatabase}
                  columnsByTable={columns.columnsByTable}
                  triggersByTable={triggers.triggersByTable}
                  indexesByTable={indexes.indexesByTable}
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
    config,
    connections,
    databases,
    schemas,
    tables,
    columns,
    triggers,
    indexes,
    views,
    routines,
    queries,
    sqlscripts,
    keys,
    status,
  } = state;

  return {
    config,
    connections,
    databases,
    schemas,
    tables,
    columns,
    triggers,
    indexes,
    views,
    routines,
    queries,
    sqlscripts,
    keys,
    status,
  };
}


export default connect(mapStateToProps)(withRouter(QueryBrowserContainer));
