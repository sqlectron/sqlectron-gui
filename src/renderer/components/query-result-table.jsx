import { debounce } from 'lodash';
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Table, ColumnGroup, Column, Cell } from 'fixed-data-table';
import TableCell from './query-result-table-cell.jsx';
import PreviewModal from './preview-modal.jsx';
import { valueToString } from '../utils/convert';


require('fixed-data-table/dist/fixed-data-table.css');
require('./query-result-table.scss');


export default class QueryResultTable extends Component {
  static propTypes = {
    widthOffset: PropTypes.number.isRequired,
    heigthOffset: PropTypes.number.isRequired,
    onCopyToClipboardClick: PropTypes.func.isRequired,
    resultItemsPerPage: PropTypes.number.isRequired,
    copied: PropTypes.bool,
    query: PropTypes.string,
    fields: PropTypes.array,
    rows: PropTypes.array,
    rowCount: PropTypes.oneOfType([
      React.PropTypes.array,
      React.PropTypes.number,
    ]),
  }

  constructor(props, context) {
    super(props, context);
    this.state = { columnWidths: {} };
    this.resizeHandler = debounce(::this.onResize, 20);
  }

  componentDidMount() {
    window.addEventListener('resize', this.resizeHandler, false);
    this.resize();
  }

  componentWillReceiveProps(nextProps) {
    this.resize(nextProps);

    if (nextProps.copied) {
      this.setState({ showCopied: true });
    }
  }

  componentDidUpdate() {
    if (this.state.showCopied) {
      /* eslint react/no-did-update-set-state: 0 */
      setTimeout(() => this.setState({ showCopied: false }), 1000);
    }

    const allVisibleRowsHeight = this.getAllVisibleRowsHeight();
    if (allVisibleRowsHeight && allVisibleRowsHeight < this.state.tableHeight) {
      this.setState({ tableHeight: allVisibleRowsHeight });
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeHandler, false);
  }

  onColumnResizeEndCallback(newColumnWidth, columnKey) {
    this.setState(({columnWidths}) => ({
      columnWidths: {
        ...columnWidths,
        [columnKey]: newColumnWidth,
      },
    }));
  }

  onOpenPreviewClick(value) {
    this.setState({ showPreview: true, valuePreview: value });
  }

  onClosePreviewClick() {
    this.setState({ showPreview: false, valuePreview: null });
  }

  onResize() {
    clearTimeout(this.resizeTimer);
    this.resizeTimer = setTimeout(::this.resize, 16);
  }

  getTextWidth(text, font) {
    // additional spacing
    const padding = 28;
    const element = document.createElement('canvas');
    const context = element.getContext('2d');
    context.font = font;
    return context.measureText(text).width + padding;
  }

  getAllVisibleRowsHeight() {
    if (!this.refs.table) {
      return null;
    }

    // additional spacing due scroll bars
    const paddingScroll = (this.props.rows.length === 1 ? 19 : 2);
    const tableElement = ReactDOM.findDOMNode(this.refs.table);
    return Array.prototype.slice.call(
      tableElement.querySelectorAll('.fixedDataTableRowLayout_rowWrapper')
    ).reduce((total, elem) => total + elem.offsetHeight, 0) + paddingScroll;
  }

  /**
   * Resolve the cell width based in the header name and the top 30 rows data.
   * It gives a better UX since the column adapts better to the table width.
   */
  resolveCellWidth(fieldName, fields, rows) {
    const font = '14px \'Lato\', \'Helvetica Neue\', Arial, Helvetica, sans-serif';
    const numRowsToFindAverage = rows.length > 30 ? 30 : rows.length;
    const maxWidth = 220;

    const headerWidth = this.getTextWidth(fieldName, `bold ${font}`);

    const averageRowsCellWidth = rows
      .slice(0, numRowsToFindAverage)
      .map(row => {
        const value = valueToString(row[fieldName]);
        return this.getTextWidth(value, font);
      })
      .reduce((prev, curr) => prev + curr, 0)
      / numRowsToFindAverage;

    if (headerWidth > averageRowsCellWidth) {
      return headerWidth > maxWidth ? maxWidth : headerWidth;
    }

    return averageRowsCellWidth > maxWidth ? maxWidth : averageRowsCellWidth;
  }

  resize(nextProps) {
    const props = nextProps || this.props;
    const widthOffset = props.widthOffset;
    const heigthOffset = props.heigthOffset;

    this.setState({
      tableWidth: window.innerWidth - (widthOffset + 25),
      tableHeight: window.innerHeight - (heigthOffset + 225),
    });
  }

  renderHeaderColumns() {
    const { rows, rowCount, onCopyToClipboardClick } = this.props;
    const styleCopied = {display: this.state.showCopied ? 'inline-block' : 'none'};
    const styleButtons = {display: this.state.showCopied ? 'none' : 'inline-block'};

    let copyPanel = null;
    if (rowCount) {
      copyPanel = (
        <div className="ui small label" title="Copy as" style={{float: 'right'}}>
          <i className="copy icon"></i>
          <a className="detail" style={styleCopied}>Copied</a>
          <a className="detail"
            style={styleButtons}
            onClick={() => onCopyToClipboardClick(rows, 'CSV')}>CSV</a>
          <a className="detail"
            style={styleButtons}
            onClick={() => onCopyToClipboardClick(rows, 'JSON')}>JSON</a>
        </div>
      );
    }

    return (
      <Cell>
        Rows: {rowCount}
        {copyPanel}
      </Cell>
    );
  }

  renderColumns() {
    const { rowCount, fields, rows } = this.props;
    const { tableWidth, columnWidths } = this.state;

    if (!rowCount) {
      return (
        <Column
          header={<Cell>No results found</Cell>}
          width={this.state.tableWidth}
        />
      );
    }

    const averageTableCellWidth = tableWidth / fields.length;
    const autoColumnWidths = fields
      .map(({ name }) => this.resolveCellWidth(name, fields, rows, averageTableCellWidth));

    // force last column fill the rest of the table width
    const totalTableWidth = autoColumnWidths.reduce((total, width) => total + width, 0);
    if (totalTableWidth < tableWidth) {
      autoColumnWidths[fields.length - 1] += tableWidth - totalTableWidth;
    }

    return fields.map(({ name }, index) => {
      return (
        <Column
          key={`${name}_${index}`}
          columnKey={name}
          header={<Cell>{name}</Cell>}
          cell={
            <TableCell
              rowIndex={index}
              data={rows}
              col={name}
              onOpenPreviewClick={::this.onOpenPreviewClick}
            />
          }
          width={columnWidths[name] || autoColumnWidths[index]}
          isResizable
        />
      );
    });
  }

  render() {
    const { rowCount } = this.props;
    const { tableWidth, tableHeight } = this.state;

    // not completed loaded yet
    if (!tableWidth) {
      return null;
    }

    let previewModal = null;
    if (this.state.showPreview) {
      previewModal = (
        <PreviewModal
          value={this.state.valuePreview}
          onCloseClick={::this.onClosePreviewClick}
        />
      );
    }

    return (
      <div>
        {previewModal}
        <Table
          ref="table"
          rowHeight={30}
          headerHeight={30}
          groupHeaderHeight={40}
          rowsCount={rowCount}
          width={tableWidth}
          height={tableHeight}
          isColumnResizing={false}
          onColumnResizeEndCallback={::this.onColumnResizeEndCallback}
        >
          <ColumnGroup header={this.renderHeaderColumns()}>
            {this.renderColumns()}
          </ColumnGroup>
        </Table>
    </div>
    );
  }
}
