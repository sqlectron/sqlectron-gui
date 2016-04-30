import React, { Component, PropTypes } from 'react';
import { debounce } from 'lodash';
import AceEditor from 'react-ace';
import 'brace/mode/sql';
import 'brace/theme/github';
import 'brace/ext/language_tools';
import QueryResult from './query-result.jsx';
import ServerDBClientInfoModal from './server-db-client-info-modal.jsx';

import { ResizableBox } from 'react-resizable';
require('./react-resizable.css');


const INFOS = {
  mysql: [
    'MySQL treats commented query as a non select query. So you may see "affected rows" for a commented query.',
    'Usually executing a single query per tab will give better results.',
  ],
  sqlserver: [
    'MSSQL treats multiple non select queries as a single query result. So you affected rows will show the amount over all queries executed in the same tab.',
    'Usually executing a single query per tab will give better results.',
  ],
};


export default class Query extends Component {
  static propTypes = {
    client: PropTypes.string.isRequired,
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
    const selectedQuery = this.refs.queryBoxTextarea.editor.getCopyText();
    this.props.onExecQueryClick(selectedQuery || this.props.query.query);
  }

  onDiscQueryClick() {
    this.props.onSQLChange('');
  }

  onShowInfoClick() {
    this.setState({ infoModalVisible: true });
  }

  onQueryBoxResize(width, height) {
    this.refs.queryBoxTextarea.editor.resize();
  }

  render() {
    const { client, query, onCopyToClipboardClick, onSQLChange } = this.props;
    const infos = INFOS[client];

    return (
      <div>
        <div>
          <ResizableBox
            className="react-resizable react-resizable-se-resize ui segment"
            height={200}
            width={500}
            onResize={::this.onQueryBoxResize}>
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
              onChange={debounce(onSQLChange, 100)}
              enableBasicAutocompletion={true}
              enableLiveAutocompletion={true}
              />
          </ResizableBox>
          <div className="ui secondary menu" style={{marginTop: 0}}>
            {infos &&
              <div className="item">
                <span>
                  <button className="ui icon button small"
                    title="Query Infomartions"
                    onClick={::this.onShowInfoClick}>
                    <i className="icon info"></i>
                  </button>
                </span>
              </div>
            }
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
          resultItemsPerPage={query.resultItemsPerPage}
          copied={query.copied}
          query={query.queryHistory[query.queryHistory.length - 1]}
          results={query.results}
          isExecuting={query.isExecuting}
          error={query.error} />
        {this.state && this.state.infoModalVisible &&
          <ServerDBClientInfoModal
            infos={infos}
            client={client}
            onCloseClick={() => this.setState({ infoModalVisible: false })} />
        }
      </div>
    );
  }
}
