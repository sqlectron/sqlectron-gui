import React, { Component, PropTypes } from 'react';
import CollapseIcon from './collapse-icon.jsx';
import DatabaseItem from './database-item.jsx';
import groupBy from 'lodash.groupby';

const STYLE = {
  header: { fontSize: '0.85em', color: '#636363' },
  menu: { marginLeft: '5px' },
  item: { wordBreak: 'break-all', cursor: 'default' },
};


export default class DbMetadataList extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    client: PropTypes.string.isRequired,
    items: PropTypes.array,
    columnsByTable: PropTypes.object,
    triggersByTable: PropTypes.object,
    indexesByTable: PropTypes.object,
    collapsed: PropTypes.bool,
    database: PropTypes.object.isRequired,
    onExecuteDefaultQuery: PropTypes.func,
    onSelectItem: PropTypes.func,
    onGetSQLScript: PropTypes.func,
  }

  constructor(props, context) {
    super(props, context);
    this.state = { tableCollapsed: {} };
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.collapsed === undefined) {
      this.setState({ collapsed: !!nextProps.collapsed });
    }
  }

  toggleCollapse() {
    this.setState({ collapsed: !this.state.collapsed });
  }

  handleTableCollapse(key) {
    this.setState({
      tableCollapsed: {
        ...this.state.tableCollapsed,
        [key]: !this.state.tableCollapsed[key] },
    });
  }

  renderHeader() {
    const {
      items,
    } = this.props;
    const title = this.state.collapsed ? 'Expand' : 'Collapse';
    const cssClass = this.state.collapsed ? 'right' : 'down';
    const cssStyle = { ...STYLE.header };
    if (!items || !items.length) {
      cssStyle.color = 'lightgray';
    }
    return (
      <span
        title={title}
        className="header clickable"
        style={cssStyle}>
        <i className={`${cssClass} triangle icon`} onClick={::this.toggleCollapse}></i>
        <span>{this.props.title}</span>
      </span>
    );
  }

  renderItems() {
    const {
      client,
      onExecuteDefaultQuery,
      onSelectItem,
      items,
      title,
      database,
      onGetSQLScript,
    } = this.props;

    if (!items || this.state.collapsed) {
      return null;
    }

    if (!items.length) {
      return (
        <span className="ui grey item"><i> No results found</i></span>
      );
    }

    const grouped = groupBy(items, 'schema');

    return Object.keys(grouped).map(key => {
      const hasGroup = !(key === 'undefined' || key === undefined || key === '');
      const hasChildren = grouped[key].length;
      const isCollapsed = !this.state.tableCollapsed[key];
      const renderChildren = !hasGroup || (hasChildren && !isCollapsed);
      const collapseArrowDirection = isCollapsed ? 'right' : 'down';
      const header = hasGroup
        ? <span
          style={{ ...STYLE.item, cursor: hasChildren ? 'pointer' : 'default' }}
          className="item"
          onClick={() => this.handleTableCollapse(key)}>
          {hasChildren ? <CollapseIcon arrowDirection={collapseArrowDirection} /> : null}
          {key}
        </span>
        : null;

      const body = renderChildren
        ? grouped[key].map(item => {
          const hasChildElements = !!onSelectItem;

          const cssStyle = { ...STYLE.item, marginLeft: hasGroup ? '0.5em' : '0px' };
          if (this.state.collapsed) {
            cssStyle.display = 'none';
          }
          cssStyle.cursor = hasChildElements ? 'pointer' : 'default';

          const { schema, name } = item;
          const fullName = schema ? `${schema}.${name}` : name;

          return (
            <DatabaseItem
              key={`${key}.${title}.${database.name}.${fullName}`}
              client={client}
              database={database}
              item={item}
              dbObjectType={this.props.title.slice(0, -1)}
              style={cssStyle}
              columnsByTable={this.props.columnsByTable}
              triggersByTable={this.props.triggersByTable}
              indexesByTable={this.props.indexesByTable}
              onSelectItem={onSelectItem}
              onExecuteDefaultQuery={onExecuteDefaultQuery}
              onGetSQLScript={onGetSQLScript} />
          );
        })
      : null;

      return (
        <div key={`list-item.${key}.${title}.${database.name}`}>
          {header}
          {body}
        </div>);
    });
  }

  render() {
    return (
      <div className="item">
        {this.renderHeader()}
        <div className="menu" style={STYLE.menu}>
          {this.renderItems()}
        </div>
      </div>
    );
  }
}
