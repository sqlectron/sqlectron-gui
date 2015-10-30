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

  constructor(props, context) {
    super(props, context);
  }

  onExecQueryClick() {
    this.props.onExecQueryClick(this.props.query.query);
  }

  onDiscQueryClick() {
    this.refs.queryBoxTextarea.value = '';
  }

  renderQueryResult() {
    const { query } = this.props;
    if (query.error) {
      return <pre>{JSON.stringify(query.error, null, 2)}</pre>;
    }

    if (!query.result) {
      return null;
    }

    return (
      <table className="ui celled table">
        <thead>
          <tr>
            {query.result.fields.map(({ name }) => (
              <th key={name}>{name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {this.renderQueryResultRows()}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={query.result.fields.length}>
              Rows: {query.result.rowCount}
            </td>
          </tr>
        </tfoot>
      </table>
    );
  }

  renderQueryResultRows() {
    const { query } = this.props;
    if (!query.result.rowCount) {
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
            /**
             * Important!!!
             * It fixes temporally a problem with electron passing
             * date objects through the remote.
             * It is already fixed in the latest electron version
             * but we still can't use it because the latest have another
             * problem passing exceptions though the remote.
             *
             * This way we can see the date value. But at least
             *  we can see the rest of the result.
             */
            if ((value + '') === '[object Date]') {
              value = 'Ignored date value';
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
                showGutter={false}
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
          {::this.renderQueryResult()}
        </div>
      </div>
    );
  }
}
