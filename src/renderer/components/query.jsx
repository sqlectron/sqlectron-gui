import React, { Component, PropTypes } from 'react';
import { debounce } from 'lodash';
import AceEditor from 'react-ace';
import 'brace/mode/sql';
import 'brace/theme/github';
import QueryResult from './query-result.jsx';

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

  render() {
    const { query, onSQLChange } = this.props;
    return (
      <div>
        <div>
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
              onChange={debounce(onSQLChange, 300)}
              />
          </div>
          <div className="ui secondary menu" style={{marginTop: 0}}>
            <div className="right menu">
              <div className="item">
                <div className="ui buttons">
                  <button
                    className={`ui positive button ${query.isExecuting ? 'loading' : ''}`}
                    onClick={::this.onExecQueryClick}>Execute</button>
                  <div className="or"></div>
                  <button
                    className={`ui button ${query.isExecuting ? 'disabled' : ''}`}
                    onClick={::this.onDiscQueryClick}>Discard</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <QueryResult
          query={query.queryHistory[query.queryHistory.length - 1]}
          fields={query.resultFields}
          rows={query.resultRows}
          rowCount={query.resultRowCount}
          isExecuting={query.isExecuting}
          error={query.error} />
      </div>
    );
  }
}
