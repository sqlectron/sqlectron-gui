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
    onCopyToClipboardClick: PropTypes.func.isRequired,
    onSQLChange: PropTypes.func.isRequired,
  }

  componentDidUpdate() {
    if (this.props.query.isExecuting && this.props.query.isDefaultSelect) {
      this.refs.queryBoxTextarea.editor.focus();
      window.scrollTo(0, 0);
    }
  }

  onExecQueryClick() {
    this.props.onExecQueryClick(this.props.query.query);
  }

  onDiscQueryClick() {
    this.props.onSQLChange('');
  }

  render() {
    const { query, onCopyToClipboardClick, onSQLChange } = this.props;
    return (
      <div>
        <div>
          <ResizableBox className="react-resizable react-resizable-se-resize ui segment" height={200} width={500}>
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
          onCopyToClipboardClick={onCopyToClipboardClick}
          copied={query.copied}
          query={query.queryHistory[query.queryHistory.length - 1]}
          fields={query.resultFields}
          rows={query.resultRows}
          rowCount={query.resultRowCount}
          affectedRows={query.resultAffectedRows}
          isExecuting={query.isExecuting}
          error={query.error} />
      </div>
    );
  }
}
