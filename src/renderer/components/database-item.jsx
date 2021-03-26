import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { sqlectron, DB_CLIENTS } from '../api';
import CollapseIcon from './collapse-icon';
import TableSubmenu from './table-submenu';
import * as eventKeys from '../../common/event';
import ContextMenu from '../utils/context-menu';

const MENU_CTX_ID = 'CONTEXT_MENU_DATABASE_LIST';

export default class DatabaseItem extends Component {
  static propTypes = {
    client: PropTypes.string.isRequired,
    database: PropTypes.object.isRequired,
    item: PropTypes.object.isRequired,
    dbObjectType: PropTypes.string.isRequired,
    style: PropTypes.object,
    columnsByTable: PropTypes.object,
    triggersByTable: PropTypes.object,
    indexesByTable: PropTypes.object,
    onSelectItem: PropTypes.func,
    onExecuteDefaultQuery: PropTypes.func,
    onGetSQLScript: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {};
    this.contextMenu = null;

    this.onContextMenu = this.onContextMenu.bind(this);
    this.onSingleClick = this.onSingleClick.bind(this);
  }

  componentWillUnmount() {
    if (this.contextMenu) {
      this.contextMenu.dispose();
      this.contextMenu = null;
    }
  }

  onSingleClick() {
    const { onExecuteDefaultQuery, database, item } = this.props;
    onExecuteDefaultQuery(database, item);
  }

  // Context menu is built dynamically on click (if it does not exist), because building
  // menu onComponentDidMount or onComponentWillMount slows table listing when database
  // has a loads of tables, because menu will be created (unnecessarily) for every table shown
  onContextMenu(event) {
    event.preventDefault();

    if (!this.contextMenu) {
      this.buildContextMenu();
    }

    this.contextMenu.popup({
      x: event.clientX,
      y: event.clientY,
    });
  }

  buildContextMenu() {
    const {
      client,
      database,
      item,
      dbObjectType,
      onExecuteDefaultQuery,
      onGetSQLScript,
    } = this.props;

    // Create unique context menu for this table
    this.contextMenu = new ContextMenu(`${MENU_CTX_ID}@${database.name}@${item.name}`);

    if (dbObjectType === 'Table' || dbObjectType === 'View') {
      this.contextMenu.append({
        label: 'Select Rows (with limit)',
        event: eventKeys.BROWSER_MENU_EXECUTE_DEFAULT_QUERY,
        click: () => onExecuteDefaultQuery(database, item),
      });
    }

    this.contextMenu.append({
      type: 'separator',
    });

    const { disabledFeatures } = DB_CLIENTS.find((dbClient) => dbClient.key === client);
    if (!disabledFeatures || !disabledFeatures.includes('scriptCreateTable')) {
      this.contextMenu.append({
        label: 'Create Statement',
        event: eventKeys.BROWSER_MENU_GET_SQL_SCRIPT_CREATE_TABLE,
        click: () => onGetSQLScript(database, item, 'CREATE', dbObjectType),
      });
    }

    if (dbObjectType === 'Table') {
      this.contextMenu.append({
        label: 'Select Statement',
        event: eventKeys.BROWSER_MENU_GET_SQL_SCRIPT_SELECT,
        click: () => onGetSQLScript(database, item, 'SELECT', dbObjectType),
      });

      this.contextMenu.append({
        label: 'Insert Statement',
        event: eventKeys.BROWSER_MENU_GET_SQL_SCRIPT_INSERT,
        click: () => onGetSQLScript(database, item, 'INSERT', dbObjectType),
      });

      this.contextMenu.append({
        label: 'Update Statement',
        event: eventKeys.BROWSER_MENU_GET_SQL_SCRIPT_UPDATE,
        click: () => onGetSQLScript(database, item, 'UPDATE', dbObjectType),
      });

      this.contextMenu.append({
        label: 'Delete Statement',
        event: eventKeys.BROWSER_MENU_GET_SQL_SCRIPT_DELETE,
        click: () => onGetSQLScript(database, item, 'DELETE', dbObjectType),
      });
    }

    this.contextMenu.build();
  }

  toggleTableCollapse() {
    this.setState({ tableCollapsed: !this.state.tableCollapsed });
  }

  renderSubItems({ schema, name }) {
    const { columnsByTable, triggersByTable, indexesByTable, database } = this.props;

    if (!columnsByTable || !columnsByTable[name]) {
      return null;
    }

    const displayStyle = {};
    if (!this.state.tableCollapsed) {
      displayStyle.display = 'none';
    }

    return (
      <div style={displayStyle}>
        <TableSubmenu
          title="Columns"
          schema={schema}
          table={name}
          itemsByTable={columnsByTable}
          database={database}
        />
        <TableSubmenu
          collapsed
          title="Triggers"
          schema={schema}
          table={name}
          itemsByTable={triggersByTable}
          database={database}
        />
        <TableSubmenu
          collapsed
          title="Indexes"
          schema={schema}
          table={name}
          itemsByTable={indexesByTable}
          database={database}
        />
      </div>
    );
  }

  render() {
    const { database, item, style, onSelectItem, dbObjectType } = this.props;
    const hasChildElements = !!onSelectItem;
    const expandChildren = hasChildElements
      ? () => {
          onSelectItem(database, item);
          this.toggleTableCollapse();
        }
      : () => {};

    const collapseArrowDirection = this.state.tableCollapsed ? 'down' : 'right';
    const tableIcon = <i className="table icon" style={{ float: 'left', margin: '0 0.3em 0 0' }} />;

    const { schema, name } = item;
    const fullName = schema ? `${schema}.${name}` : name;

    return (
      <div>
        <span
          style={style}
          className={`item item-${dbObjectType}`}
          onContextMenu={this.onContextMenu}>
          {dbObjectType === 'Table' ? (
            <CollapseIcon arrowDirection={collapseArrowDirection} expandAction={expandChildren} />
          ) : null}
          {dbObjectType === 'Table' ? tableIcon : null}
          <span onClick={this.onSingleClick}>{fullName}</span>
        </span>
        {this.renderSubItems(item)}
      </div>
    );
  }
}
