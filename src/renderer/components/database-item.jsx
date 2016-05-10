import React, { Component, PropTypes } from 'react';
import TableSubmenu from './table-submenu.jsx';
import { Menu, MenuItem } from 'remote';


const STYLE = {
  item: { wordBreak: 'break-all', cursor: 'default' },
};


export default class DatabaseItem extends Component {
  static propTypes = {
    database: PropTypes.object.isRequired,
    item: PropTypes.object.isRequired,
    dbObjectType: PropTypes.string.isRequired,
    title: PropTypes.string,
    style: PropTypes.object,
    columnsByTable: PropTypes.object,
    triggersByTable: PropTypes.object,
    onSelectItem: PropTypes.func,
    onDoubleClick: PropTypes.func,
    onGetTableCreateScript: PropTypes.func,
    onGetTableSelectScript: PropTypes.func,
    onGetTableInsertScript: PropTypes.func,
    onGetTableUpdateScript: PropTypes.func,
    onGetTableDeleteScript: PropTypes.func,
    onGetViewCreateScript: PropTypes.func,
  }

  constructor(props, context) {
    super(props, context);
    this.state = {};
    this.contextMenu;
  }

  // Context menu is built dinamically on click (if it does not exist), because building
  // menu onComponentDidMount or onComponentWillMount slows table listing when database
  // has a loads of tables, because menu will be created (unnecessarily) for every table shown
  onContextMenu(e){
    e.preventDefault();
    if (!this.contextMenu){
      this.buildContextMenu();
    }
    this.contextMenu.popup(e.clientX, e.clientY);
  }

  buildContextMenu(){
    const {
      database,
      item,
      dbObjectType,
      onDoubleClick,
      onGetTableCreateScript,
      onGetTableSelectScript,
      onGetTableInsertScript,
      onGetTableUpdateScript,
      onGetTableDeleteScript,
      onGetViewCreateScript,
    } = this.props;
    const scriptFuncs = [onGetTableCreateScript, onGetTableSelectScript, onGetTableInsertScript, onGetTableUpdateScript, onGetTableDeleteScript];
    const scriptsNames = ['CREATE', 'SELECT', 'INSERT', 'UPDATE', 'DELETE'];

    this.contextMenu = new Menu();
    if (dbObjectType === 'Tables' || dbObjectType === 'Views') {
      this.contextMenu.append(new MenuItem({
        label: `Execute default query`,
        click: onDoubleClick
      }));
      if (dbObjectType === 'Tables') {
        scriptFuncs.map((currentValue, index) => {
          this.contextMenu.append(new MenuItem({
            label: `${scriptsNames[index]} script`,
            click: currentValue.bind(this, database, item)
          }));
        });
      } else {
        this.contextMenu.append(new MenuItem({
          label: `CREATE script`,
          click: onGetViewCreateScript.bind(this, database, item)
        }));
      }
    }
  }

  toggleTableCollapse() {
    this.setState({ tableCollapsed: !this.state.tableCollapsed });
  }

  renderSubItems(table) {
    const { columnsByTable, triggersByTable, database } = this.props;

    if (!columnsByTable || !columnsByTable[table]) {
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
          table={table}
          itemsByTable={columnsByTable}
          database={database}/>
        <TableSubmenu
          collapsed
          title="Triggers"
          table={table}
          itemsByTable={triggersByTable}
          database={database}/>
      </div>
    );
  }

  render() {
    const { database, item, title, style, onSelectItem, dbObjectType } = this.props;
    const hasChildElements = !!onSelectItem;
    const onSingleClick = hasChildElements
      ? () => {onSelectItem(database, item); this.toggleTableCollapse();}
      : () => {};

    const collapseCssClass = this.state.tableCollapsed ? 'down' : 'right';
    const collapseIcon = (
      <i className={`${collapseCssClass} triangle icon`} style={{float: 'left', margin: '0 0.15em 0 -1em'}}></i>
    );
    const tableIcon = (
      <i className="table icon" style={{float: 'left', margin: '0 0.3em 0 0'}}></i>
    );

    return (
      <div>
        <span
          title={title}
          style={style}
          className="item"
          onClick={onSingleClick}
          onContextMenu={::this.onContextMenu}>
          { dbObjectType === 'Tables' ? collapseIcon : null }
          { dbObjectType === 'Tables' ? tableIcon : null }
          {item.name}
        </span>
        {this.renderSubItems(item.name)}
      </div>
    );
  }
}
