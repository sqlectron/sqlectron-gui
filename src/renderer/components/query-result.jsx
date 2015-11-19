import React, { Component, PropTypes } from 'react';
import Loader from '../components/loader.jsx';


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

  renderQueryResultRows(rowCount) {
    const { fields, rows } = this.props;
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
    const { isExecuting, error, rows, rowCount, fields } = this.props;
    if (error) {
      if (error.message) {
        return <div className="ui negative message">{error.message}</div>;
      }
      return <pre>{JSON.stringify(error, null, 2)}</pre>;
    }

    if (isExecuting) {
      return (
        <div style={{minHeight: '250px'}}>
          <Loader message="Loading" type="active" inverted />
        </div>
      );
    }

    if (!rows) {
      return null;
    }

    const queryWithOutput = !!(fields && fields.length);
    if (!queryWithOutput) {
      return <div className="ui positive message">Query executed successfully</div>;
    }

    return (
      <table className="ui selectable small celled table">
        <thead>
          <tr>
            {fields.map(({ name }) => (
              <th key={name}>{name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {this.renderQueryResultRows(rowCount)}
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
