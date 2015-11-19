import React, { Component, PropTypes } from 'react';
import { debounce } from 'lodash';
import AceEditor from 'react-ace';
import 'brace/mode/sql';
import 'brace/theme/github';
import QueryResult from './query-result.jsx';

import { ResizableBox } from 'react-resizable';
require('./react-resizable.css');


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
          <ResizableBox className="react-resizable ui segment" height={200} width={500}>
            <AceEditor
              mode="sql"
              theme="github"
              name="querybox"
              height="100%"
              width="100%"
              ref="queryBoxTextarea"
              value={query.query}
              showPrintMargin={false}
              editorProps={{$blockScrolling: Infinity}}
              onChange={debounce(onSQLChange, 300)}
              />
          </ResizableBox>
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
