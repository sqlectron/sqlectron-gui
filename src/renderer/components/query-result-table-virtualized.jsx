import { debounce } from 'lodash';
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

import TableCell from './query-result-table-virtualized-cell.jsx';
import PreviewModal from './preview-modal.jsx';
import { valueToString } from '../utils/convert';

import 'react-virtualized/styles.css';
import { Grid, ScrollSync } from 'react-virtualized'
import classNames from 'classnames';
import scrollbarSize from 'dom-helpers/util/scrollbarSize'
import Draggable from 'react-draggable';

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

    cellClass: PropTypes.string,
    nullCellClass: PropTypes.string,
   
    rowCount: PropTypes.oneOfType([
      React.PropTypes.array,
      React.PropTypes.number,
    ]),
  }

  constructor(props, context) {
    super(props, context);
    this.state = { columnWidths: {}, 
      autoColumnWidths: [],
      columnWidths: {}
    };
    this.renderCell = this.renderCell.bind(this);
    this.renderHeaderCell = this.renderHeaderCell.bind(this);
    this.getColumnWidth = this.getColumnWidth.bind(this);
    this.renderNoRows = this.renderNoRows.bind(this);
  }

  componentDidMount() {
    window.addEventListener(
      'resize',
      debounce(::this.onResize, 20),
      false,
    );
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

    // additional spacing to not show vertical scroll
    const padding = 2;
    const tableElement = ReactDOM.findDOMNode(this.refs.table);
    return Array.prototype.slice.call(
      tableElement.querySelectorAll('.fixedDataTableRowLayout_rowWrapper')
    ).reduce((total, elem) => total + elem.offsetHeight, 0) + padding;
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
      .reduce((prev, curr) => prev + curr, 0) / numRowsToFindAverage;

    if (headerWidth > averageRowsCellWidth) {
      return headerWidth > maxWidth ? maxWidth : headerWidth;
    }

    return averageRowsCellWidth > maxWidth ? maxWidth : averageRowsCellWidth;
  }

  renderCell(params) {

    var field = this.props.fields[params.columnIndex];

    return <TableCell
              rowIndex={params.rowIndex}
              data={this.props.rows}
              col={field.name}
              onOpenPreviewClick={::this.onOpenPreviewClick}
            />

  }

  handleStart() {
  }

  handleDrag() {
  }

  handleStop(data,e,move) {

    var originalWidth = 0;

    var columnWidths = this.state.columnWidths;

    if ( data.name && columnWidths && columnWidths[data.name] !== undefined ) {
      originalWidth = columnWidths[data.name];
    } else if ( this.state.autoColumnWidths && this.state.autoColumnWidths[data.index] !== undefined ) {
      originalWidth = this.state.autoColumnWidths[data.index];
    }

    columnWidths[data.name] = Math.max((originalWidth + move.x),10);

    this.setState({columnWidths:columnWidths});
    
    if ( this.headerGrid ) {
      this.headerGrid.measureAllCells();
      this.headerGrid.recomputeGridSize();
      this.headerGrid.forceUpdate();
    }

    if ( this.rowsGrid ) {
      this.rowsGrid.measureAllCells();
      this.rowsGrid.recomputeGridSize();
      this.rowsGrid.forceUpdate();
    }


  }

  renderHeaderCell(params) {

    var field = this.props.fields[params.columnIndex];
    var handleStart = this.handleStart.bind(this,{name:field.name,index:params.columnIndex});
    var handleDrag = this.handleDrag.bind(this,{name:field.name,index:params.columnIndex});
    var handleStop = this.handleStop.bind(this,{name:field.name,index:params.columnIndex});
    
    return <div className="item">
        
        <span>{field.name}</span>
        
        {(() => {
          
          // We don't want the resizable handle on the last column for layout reasons
          if ( (this.props.fields.length-1) != params.columnIndex ) {

             return <Draggable
                axis="x"
                onStart={handleStart}
                onDrag={handleDrag}
                onStop={handleStop}
                position={{x:0,y:0}}
                zIndex={999}>

                <div className="draggable-handle"></div>

              </Draggable>

          }
        
        })()}

    </div>;

  }

  renderNoRows() {
    return <div style={{textAlign:"center",fontSize:"16px"}}>No results found</div>;
  }

  resize(nextProps) {
    const props = nextProps || this.props;
    const widthOffset = props.widthOffset;
    const heigthOffset = props.heigthOffset;

    this.setState({
      tableWidth: window.innerWidth - (widthOffset + 40),
      tableHeight: window.innerHeight - (heigthOffset + 225),
    });
  }

  renderHeader() {
    const { rows, rowCount, onCopyToClipboardClick } = this.props;
    const { tableWidth, tableHeight } = this.state;
    const styleCopied = {display: this.state.showCopied ? 'inline-block' : 'none'};
    const styleButtons = {display: this.state.showCopied ? 'none' : 'inline-block'};

    let copyPanel = null;
    if (rowCount) {
      copyPanel = (
        <div className="ui small label" title="Copy as" style={{"float": "right","margin": "3px"}}>
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
      <div style={{"height":"32px","width":tableWidth}}>
        <div style={{"marginLeft":"10px","float":"left"}}>Rows: {rowCount}</div>
        {copyPanel}
      </div>
    );
  }

  getColumnWidth({index}) {
    var field = this.props.fields[index];
    if ( field && this.state.columnWidths && this.state.columnWidths[field.name] !== undefined ) {
      return this.state.columnWidths[field.name];
    } else if ( this.state.autoColumnWidths && this.state.autoColumnWidths[index] !== undefined ) {
      return this.state.autoColumnWidths[index];
    } else {
      return 50;
    }
  }

  render() {
    const { rowCount, fields, rows } = this.props;
    const { tableWidth, tableHeight } = this.state;
    const averageTableCellWidth = tableWidth / fields.length;

    // not completed loaded yet
    if (!tableWidth) {
      return null;
    }

    var j = 0, totalColumnWidths = 0, autoColumnWidths = fields.map(({ name, index }) => this.resolveCellWidth(name, fields, rows, averageTableCellWidth))

    for ( j=0; j < autoColumnWidths.length; j=j+1 ) {
        totalColumnWidths = totalColumnWidths + autoColumnWidths[j];
        if ( (j+1) === autoColumnWidths.length && totalColumnWidths < tableWidth ) {
            totalColumnWidths = totalColumnWidths - autoColumnWidths[j];
            autoColumnWidths[j] = (tableWidth - totalColumnWidths);
        }
    }

    this.state.autoColumnWidths = autoColumnWidths;

    let previewModal = null;
    if (this.state.showPreview) {
      previewModal = (
        <PreviewModal
          value={this.state.valuePreview}
          onCloseClick={::this.onClosePreviewClick}
        />
      );
    }

    var self = this;

    return (
      <div>
        {previewModal}

        <ScrollSync>
          {({ clientHeight, clientWidth, onScroll, scrollHeight, scrollLeft, scrollTop, scrollWidth }) => {

             return ( <div>
                
                {this.renderHeader()}

                {(() => {

                    if ( fields.length > 0 ) {

                        return <div style={{position:"relative"}}>

                          <div className="scrollPlaceholder" 
                            style={{left:(tableWidth - scrollbarSize()),
                              width:scrollbarSize()}}></div>

                          <Grid
                              ref={(ref) => self.headerGrid = ref}
                              columnWidth={this.getColumnWidth}
                              columnCount={fields.length}
                              height={30}
                              cellRenderer={this.renderHeaderCell}
                              className="grid-header-row"
                              rowHeight={30}
                              rowCount={1}
                              width={tableWidth - scrollbarSize()}
                              scrollLeft={scrollLeft}
                          >

                          </Grid>

                      </div>

                    }                    

                })()}

                <Grid
                    ref={(ref) => this.rowsGrid = ref}
                    cellRenderer={this.renderCell}
                    width={tableWidth}
                    height={Math.min((tableHeight-62),(rowCount*32))}
                    rowHeight={28}
                    onScroll={onScroll}
                    rowCount={rowCount}
                    columnCount={fields.length}
                    columnWidth={this.getColumnWidth}
                    rowsCount={rowCount}
                    noContentRenderer={this.renderNoRows}
                >

                </Grid>
            </div>)

          }}

        </ScrollSync>
    </div>
    );
  }
}
