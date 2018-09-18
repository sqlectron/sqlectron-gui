import React, { Component, PropTypes } from 'react';
import CollapseIcon from './collapse-icon.jsx';
import TableSubmenu from './table-submenu.jsx';
import { remote } from 'electron'; // eslint-disable-line import/no-unresolved
import { sqlectron } from '../../browser/remote';

const Menu = remote.Menu;
const MenuItem = remote.MenuItem;
const CLIENTS = sqlectron.db.CLIENTS;


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
  }

  constructor(props, context) {
    super(props, context);
    this.state = {};
    this.contextMenu = null;
  }

  onSingleClick() {
    const { onExecuteDefaultQuery, database, item } = this.props;
    onExecuteDefaultQuery(database, item);
  }

  // Context menu is built dinamically on click (if it does not exist), because building
  // menu onComponentDidMount or onComponentWillMount slows table listing when database
  // has a loads of tables, because menu will be created (unnecessarily) for every table shown
  onContextMenu(event) {
    event.preventDefault();

    if (!this.contextMenu) {
      this.buildContextMenu();
    }

    this.contextMenu.popup(event.clientX, event.clientY);
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

    this.contextMenu = new Menu();
    if (dbObjectType === 'Table' || dbObjectType === 'View') {
      this.contextMenu.append(new MenuItem({
        label: 'Select Rows (with limit)',
        click: onExecuteDefaultQuery.bind(this, database, item),
      }));
    }

    this.contextMenu.append(new MenuItem({ type: 'separator' }));

    const { disabledFeatures } = CLIENTS.find(dbClient => dbClient.key === client);
    if (!disabledFeatures || !~disabledFeatures.indexOf('scriptCreateTable')) {
      this.contextMenu.append(new MenuItem({
        label: 'Create Statement',
        click: onGetSQLScript.bind(this, database, item, 'CREATE', dbObjectType),
      }));
    }

    if (dbObjectType === 'Table') {
      const actionTypes = ['SELECT', 'INSERT', 'UPDATE', 'DELETE'];
      const labelsByTypes = {
        SELECT: 'Select Statement',
        INSERT: 'Insert Statement',
        UPDATE: 'Update Statement',
        DELETE: 'Delete Statement',
      };

      actionTypes.forEach(actionType => {
        this.contextMenu.append(new MenuItem({
          label: labelsByTypes[actionType],
          click: onGetSQLScript.bind(this, database, item, actionType, dbObjectType),
        }));
      });
    }
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
          database={database} />
        <TableSubmenu
          collapsed
          title="Triggers"
          schema={schema}
          table={name}
          itemsByTable={triggersByTable}
          database={database} />
        <TableSubmenu
          collapsed
          title="Indexes"
          schema={schema}
          table={name}
          itemsByTable={indexesByTable}
          database={database} />
      </div>
    );
  }

  render() {
    const { database, item, style, onSelectItem, dbObjectType } = this.props;
    const hasChildElements = !!onSelectItem;
    const expandChildren = hasChildElements
      ? () => { onSelectItem(database, item); this.toggleTableCollapse(); }
      : () => {};

    const collapseArrowDirection = this.state.tableCollapsed ? 'down' : 'right';
    const tableIcon = (
      <i className="table icon" style={{ float: 'left', margin: '0 0.3em 0 0' }}></i>
    );

    const { schema, name } = item;
    const fullName = schema ? `${schema}.${name}` : name;


    return (
      <div>
        <span
          style={style}
          className="item"
          onContextMenu={::this.onContextMenu}>
          {dbObjectType === 'Table'
            ? <CollapseIcon
              arrowDirection={collapseArrowDirection}
              expandAction={expandChildren} />
            : null
          }
          {dbObjectType === 'Table' ? tableIcon : null}
          <span onClick={::this.onSingleClick}>{fullName}</span>
        </span>
        {this.renderSubItems(item)}
      </div>
    );
  }
}
