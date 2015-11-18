import React, { Component, PropTypes } from 'react';


export default class QueryResult extends Component {
  static propTypes = {
    query: PropTypes.string,
    fields: PropTypes.array,
    rows: PropTypes.array,
    rowCount: PropTypes.number,
    error: PropTypes.object,
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.query !== this.props.query;
  }

  renderQueryResultRows(rowCount) {
    const { fields, rows } = this.props;
    if (!rowCount) {
      return (
        <tr>
          <td colSpan={fields.length}>Not results found</td>
        </tr>
      );
    }

    return rows.map((row, index) => {
      const columnNames = Object.keys(row);
      return (
        <tr key={index}>
          {columnNames.map(name => {
            let value = row[name];
            if (typeof value === 'object') {
              value = JSON.stringify(value);
            }
            return <td key={name}>{value}</td>;
          })}
        </tr>
      );
    });
  }

  render() {
    const { error, rows, rowCount, fields } = this.props;
    if (error) {
      if (error.message) {
        return <div className="ui red message">{error.message}</div>;
      }
      return <pre>{JSON.stringify(error, null, 2)}</pre>;
    }

    if (!rows) {
      return null;
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
