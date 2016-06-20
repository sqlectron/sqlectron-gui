import React, { Component, PropTypes } from 'react';
import DatabaseItem from './database-item.jsx';
import ScrollerOffset from './scroller-offset.jsx';
import { VirtualScroll } from 'react-virtualized';
import 'react-virtualized/styles.css';

const STYLE = {
  header: { fontSize: '0.85em', color: '#636363' },
  menu: { marginLeft: '5px' },
  item: { wordBreak: 'break-all', cursor: 'default' },
};


export default class DbMetadataList extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    items: PropTypes.array,
    columnsByTable: PropTypes.object,
    triggersByTable: PropTypes.object,
    collapsed: PropTypes.bool,
    database: PropTypes.object.isRequired,
    onExecuteDefaultQuery: PropTypes.func,
    onSelectItem: PropTypes.func,
    onGetSQLScript: PropTypes.func,
    scrollHeight: PropTypes.number.isRequired,
    scrollTop: PropTypes.number.isRequired,
    offsetTop: PropTypes.number.isRequired,
    width: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number]),
  }

  constructor(props, context) {
    super(props, context);
    this.state = {
      tableheights: {},
      showcolumns: {},
      showtriggers: {},
      tableCollapsed: {},
    };
    this.recalc = false;
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.collapsed === undefined) {
      this.setState({ collapsed: !!nextProps.collapsed });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if ((this.props.columnsByTable !== nextProps.columnsByTable) ||
    (this.state.tableheights !== nextState.tableheights) ||
    this.recalc === true ||
    nextProps.items !== this.props.items ||
    this.state.collapsed !== nextState.collapsed) {
      this.recalc = true;
      return true;
    }
    return false;
  }

  componentDidUpdate() {
    if (this.recalc === true) {
      this.recalc = false;
      this.metadataScroll.recomputeRowHeights();
      this.metadataScroll.forceUpdate();
    }
  }

  onAdjustHeight({ height, table, showcolumns, showtriggers, tableCollapsed }) {
    const temptableheights = this.state.tableheights;
    const tempshowcolumns = this.state.showcolumns;
    const tempshowtriggers = this.state.showtriggers;
    const temptablecollapsed = this.state.tableCollapsed;
    if (temptableheights[table] !== height) {
      temptableheights[table] = height;
      tempshowcolumns[table] = showcolumns;
      tempshowtriggers[table] = showtriggers;
      temptablecollapsed[table] = tableCollapsed;
      this.setState({
        tableheights: temptableheights,
        showcolumns: tempshowcolumns,
        showtriggers: tempshowtriggers,
        tableCollapsed: temptablecollapsed });
      this.recalc = true;
    }
  }

  toggleCollapse() {
    this.setState({ collapsed: !this.state.collapsed });
  }

  rowHeight({ index }) {
    let height = 30;
    const table = this.props.items[index];

    if (this.state.tableheights[table.name]) {
      height = this.state.tableheights[table.name] + 26;
    }

    return height;
  }

  renderHeader() {
    const title = this.state.collapsed ? 'Expand' : 'Collapse';
    const cssClass = this.state.collapsed ? 'right' : 'down';

    return (
      <span
        title={title}
        className="header clickable"
        onClick={::this.toggleCollapse}
        style={STYLE.header}>
        <i className={`${cssClass} triangle icon`}></i>
        {this.props.title}
      </span>
    );
  }

  renderItem({ index }) {
    const {
      onExecuteDefaultQuery,
      onSelectItem,
      items,
      database,
      onGetSQLScript,
      columnsByTable,
      triggersByTable,
      title,
    } = this.props;

    const item = items[index];

    const hasChildElements = !!onSelectItem;

    const cssStyle = { ...STYLE.item };
    if (this.state.collapsed) {
      cssStyle.display = 'none';
    }
    cssStyle.cursor = hasChildElements ? 'pointer' : 'default';

    return (
      <DatabaseItem
        key={item.name}
        database={database}
        item={item}
        dbObjectType={title.slice(0, -1)}
        style={cssStyle}
        showtriggers={!!this.state.showtriggers[item.name]}
        showcolumns={!!this.state.showcolumns[item.name]}
        tableCollapsed={!!this.state.tableCollapsed[item.name]}
        columnsByTable={columnsByTable}
        triggersByTable={triggersByTable}
        onAdjustHeight={::this.onAdjustHeight}
        onSelectItem={onSelectItem}
        onExecuteDefaultQuery={onExecuteDefaultQuery}
        onGetSQLScript={onGetSQLScript} />
      );
  }

  render() {
    const {
      items,
      scrollHeight,
      scrollTop,
      offsetTop,
      width,
    } = this.props;

    return (
      <div className="item">
        {this.renderHeader()}
        <div className="menu" style={STYLE.menu}>
          <ScrollerOffset
            scrollHeight={scrollHeight}
            scrollTop={scrollTop}
            offsetTop={offsetTop}>

            {({ scrollHeight, scrollTop }) => (
              <VirtualScroll
                ref={(ref) => this.metadataScroll = ref}
                height={scrollHeight}
                rowCount={(items && !this.state.collapsed) ? items.length : 0}
                rowHeight={::this.rowHeight}
                rowRenderer={::this.renderItem}
                scrollTop={Math.max(scrollTop, 1)}
                autoHeight
                width={width}
              />
            )}
          </ScrollerOffset>
        </div>
      </div>
    );
  }
}
