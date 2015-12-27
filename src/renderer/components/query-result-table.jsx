import React, { Component, PropTypes } from 'react';
import ReactPaginate from 'react-paginate';

require('./query-result-table.scss');


const perPage = 50;


export default class QueryResultTable extends Component {
  static propTypes = {
    onCopyToClipboardClick: PropTypes.func.isRequired,
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
    this.state = { currentPage: 1 };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.copied) {
      this.setState({ showCopied: true });
    }
  }

  componentDidUpdate() {
    if (this.state.showCopied) {
      /* eslint react/no-did-update-set-state: 0 */
      setTimeout(() => this.setState({ showCopied: false }), 1000);
    }
  }

  handlePageClick({ selected: pageIndex }) {
    this.setState({ currentPage: pageIndex + 1 });
  }

  renderQueryResultRows({ fields, rows, rowCount }) {
    if (!rowCount) {
      return (
        <tr>
          <td colSpan={fields.length}>No results found</td>
        </tr>
      );
    }

    return rows.map((row, index) => {
      const columnNames = Object.keys(row);
      return (
        <tr key={index}>
          {columnNames.map(name => {
            return <td key={name}>{row[name]}</td>;
          })}
        </tr>
      );
    });
  }

  render() {
    const { rows, fields, rowCount, onCopyToClipboardClick } = this.props;
    const { currentPage } = this.state;
    const startAt = (currentPage - 1) * perPage;
    const endAt = startAt + perPage;
    const rowsCurrentPage = rows.slice(startAt, endAt);
    const numPages = Math.ceil(rows.length / perPage);

    const styleCopied = {display: this.state.showCopied ? 'inline-block' : 'none'};
    const styleButtons = {display: this.state.showCopied ? 'none' : 'inline-block'};

    return (
      <table className="query-result-table ui selectable small celled table">
        <thead>
          <tr>
            {fields.map(({ name }) => (
              <th key={name}>{name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {this.renderQueryResultRows({ fields, rows: rowsCurrentPage, rowCount })}
        </tbody>
        <tfoot>
          <tr>
            <th colSpan={fields.length}>
              Rows: {rowCount}
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
            </th>
          </tr>
          {
            rows.length > perPage &&
            <tr>
              <th colSpan={fields.length} className="pagination">
                <ReactPaginate
                  previousLabel={<i className="chevron circle left icon"></i>}
                  nextLabel={<i className="chevron circle right icon"></i>}
                  breakLabel={<li className="break"><a>...</a></li>}
                  pageNum={numPages}
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={5}
                  clickCallback={::this.handlePageClick}
                  activeClassName={"active"} />
              </th>
           </tr>
          }
        </tfoot>
      </table>
    );
  }
}
