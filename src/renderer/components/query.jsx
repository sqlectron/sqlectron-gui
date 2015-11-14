import React, { Component, PropTypes } from 'react';
import { debounce } from 'lodash';
import AceEditor from 'react-ace';
import 'brace/mode/sql';
import 'brace/theme/github';

const STYLES = {
  queryBox: {
  },
  resultBox: {
    background: '#ececec',
  },
};

export default class Query extends Component {
  static propTypes = {
    query: PropTypes.object.isRequired,
    onExecQueryClick: PropTypes.func.isRequired,
    onSQLChange: PropTypes.func.isRequired,
  }

  onExecQueryClick() {
    this.props.onExecQueryClick(this.props.query.query);
  }

  onDiscQueryClick() {
    this.props.onSQLChange('');
  }

  renderQueryResult() {
    const { query } = this.props;
    if (query.error) {
      if (query.error.message) {
        return <div className="ui red message">{query.error.message}</div>;
      }
      return <pre>{JSON.stringify(query.error, null, 2)}</pre>;
    }

    if (!query.result) {
      return null;
    }

    const rowCount = query.result.rowCount
      || (query.result.rows && query.result.rows.length)
      || 0;

    return (
      <table className="ui selectable small celled table">
        <thead>
          <tr>
            {query.result.fields.map(({ name }) => (
              <th key={name}>{name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {this.renderQueryResultRows(rowCount)}
        </tbody>
        <tfoot>
          <tr>
            <th colSpan={query.result.fields.length}>
              Rows: {rowCount}
            </th>
          </tr>
        </tfoot>
      </table>
    );
  }

  renderQueryResultRows(rowCount) {
    const { query } = this.props;
    if (!rowCount) {
      return (
        <tr>
          <td colSpan={query.result.fields.length}>
            Not results found
          </td>
        </tr>
      );
    }

    return query.result.rows.map((row, index) => {
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
    const { query, onSQLChange } = this.props;
    return (
      <div>
        <div>
          <div style={STYLES.queryBox}>
            <div className="ui segment">
              <AceEditor
                mode="sql"
                theme="github"
                name="querybox"
                height="10em"
                width="100%"
                ref="queryBoxTextarea"
                value={query.query}
                editorProps={{$blockScrolling: true}}
                onChange={debounce(onSQLChange, 750)}
                />
            </div>
            <div className="ui secondary menu" style={{marginTop: 0}}>
              <div className="right menu">
                <div className="item">
                  <div className="ui buttons">
                    <button className="ui positive button" onClick={::this.onExecQueryClick}>Execute</button>
                    <div className="or"></div>
                    <button className="ui button" onClick={::this.onDiscQueryClick}>Discard</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={STYLES.resultBox}>
          {this.renderQueryResult()}
        </div>
      </div>
    );
  }
}
