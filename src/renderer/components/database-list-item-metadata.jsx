import React, { Component, PropTypes } from 'react';
import DatabaseItem from './database-item.jsx';


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
    this.state = {};
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.collapsed === undefined) {
      this.setState({ collapsed: !!nextProps.collapsed });
    }
  }

  toggleCollapse() {
    this.setState({ collapsed: !this.state.collapsed });
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
        onClick={::this.toggleCollapse}
        style={cssStyle}>
        <i className={`${cssClass} triangle icon`}></i>
        {this.props.title}
      </span>
    );
  }

  renderItems() {
    const {
      client,
      onExecuteDefaultQuery,
      onSelectItem,
      items,
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

    return items.map(item => {
      const hasChildElements = !!onSelectItem;

      const cssStyle = { ...STYLE.item };
      if (this.state.collapsed) {
        cssStyle.display = 'none';
      }
      cssStyle.cursor = hasChildElements ? 'pointer' : 'default';

      return (
        <DatabaseItem
          key={item.name}
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
