import React, { Component, PropTypes } from 'react';
import Loader from './loader.jsx';
import Message from './message.jsx';
import QueryResultTable from './query-result-table.jsx';


export default class QueryResult extends Component {
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
    affectedRows: PropTypes.oneOfType([
      React.PropTypes.array,
      React.PropTypes.number,
    ]),
    isExecuting: PropTypes.bool,
    error: PropTypes.object,
  }

  shouldComponentUpdate(nextProps) {
    return (
      (!nextProps.isExecuting && this.props.isExecuting) ||
      (nextProps.query !== this.props.query) ||
      (nextProps.copied && !this.props.copied)
    );
  }

  componentWillUpdate(nextProps) {
    const renderingResults = !nextProps.isExecuting && this.props.isExecuting;
    if (renderingResults && this.refs.loader) {
      const loader = this.refs.loader.getElementsByClassName('text loader')[0];
      loader.innerText = 'Rendering result';
    }
  }

  renderQueryResult({ fields, rows, rowCount, affectedRows, queryIndex, totalQueries }) {
    const queryWithOutput = !!(fields && fields.length);
    if (!queryWithOutput && affectedRows !== undefined) {
      const msgAffectedRows = affectedRows ? `Affected rows: ${affectedRows}.` : '';
      return (
        <Message
          key={queryIndex}
          message={`Query executed successfully. ${msgAffectedRows}`}
          type="success" />
      );
    }

    const tableResult = (
      <QueryResultTable
        copied={this.props.copied}
        key={queryIndex}
        fields={fields}
        rows={rows}
        rowCount={rowCount}
        onCopyToClipboardClick={this.props.onCopyToClipboardClick} />
    );

    if (totalQueries === 1) {
      return tableResult;
    }

    return (
      <div key={queryIndex} className="ui segment">
        <div className="ui top left attached label">
          Query {queryIndex + 1}
        </div>
        {tableResult}
      </div>
    );
  }

  render() {
    const { isExecuting, error, rows, fields, rowCount, affectedRows } = this.props;
    if (error) {
      if (error.message) {
        return <div className="ui negative message">{error.message}</div>;
      }
      return <pre>{JSON.stringify(error, null, 2)}</pre>;
    }

    if (isExecuting) {
      return (
        <div ref="loader" style={{minHeight: '250px'}}>
          <Loader message="Loading" type="active" inverted />
        </div>
      );
    }

    if (!rows) {
      return null;
    }

    const isMultipleResult = fields && fields.length && Array.isArray(fields[0]);
    const _fields = isMultipleResult ? fields : [fields];
    const _rows = isMultipleResult ? rows : [rows];
    const _rowsCount = isMultipleResult ? rowCount : [rowCount];
    const _affectedRows = isMultipleResult ? affectedRows : [affectedRows];
    const totalQueries = _fields.length;

    return (
      <div id="query-result">
        {
          _fields.map((field, idx) => this.renderQueryResult({
            totalQueries,
            fields: _fields[idx],
            rows: _rows[idx],
            rowCount: _rowsCount[idx],
            affectedRows: _affectedRows[idx],
            queryIndex: idx,
          }))
        }
      </div>
    );
  }
}
