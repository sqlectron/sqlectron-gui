import React, { Component, PropTypes } from 'react';
import Loader from './loader.jsx';
import Message from './message.jsx';


export default class QueryResult extends Component {
  static propTypes = {
    query: PropTypes.string,
    fields: PropTypes.array,
    rows: PropTypes.array,
    rowCount: PropTypes.number,
    isExecuting: PropTypes.bool,
    error: PropTypes.object,
  }

  shouldComponentUpdate(nextProps) {
    return (
      (!nextProps.isExecuting && this.props.isExecuting) ||
      (nextProps.query !== this.props.query)
    );
  }

  componentWillUpdate(nextProps) {
    const renderingResults = !nextProps.isExecuting && this.props.isExecuting;
    if (renderingResults && this.refs.loader) {
      const loader = this.refs.loader.getElementsByClassName('text loader')[0];
      loader.innerText = 'Rendering result';
    }
  }

  renderQueryResult({ fields, rows, rowCount, queryIndex, totalQueries }) {
    const queryWithOutput = !!(fields && fields.length);
    if (!queryWithOutput) {
      return (
        <Message
          message="Query executed successfully"
          type="success" />
      );
    }

    const tableResult = (
      <table className="ui selectable small celled table">
        <thead>
          <tr>
            {fields.map(({ name }) => (
              <th key={name}>{name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {this.renderQueryResultRows({ fields, rows, rowCount })}
        </tbody>
        <tfoot>
          <tr>
            <th colSpan={fields.length}>
              Rows: {rowCount}
            </th>
          </tr>
        </tfoot>
      </table>
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
            return <td key={name}>{valueToString(row[name])}</td>;
          })}
        </tr>
      );
    });
  }

  render() {
    const { isExecuting, error, rows, fields } = this.props;
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
    const totalQueries = _fields.length;

    return (
      <div style={{overflowY: 'scroll'}}>
        {
          _fields.map((field, idx) => this.renderQueryResult({
            totalQueries,
            fields: _fields[idx],
            rows: _rows[idx],
            rowCount: _rows[idx].length,
            queryIndex: idx,
          }))
        }
      </div>
    );
  }
}


function valueToString(value) {
  if (!value) { return value; }
  if (value.toISOString) {
    return value.toISOString();
  }
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  return value;
}
