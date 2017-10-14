import React, { Component, PropTypes } from 'react';
import debounce from 'lodash.debounce';
import AceEditor from 'react-ace';
import ace from 'brace';
import 'brace/mode/sql';
import 'brace/theme/github';
import 'brace/ext/language_tools';
import 'brace/ext/searchbox';
import QueryResult from './query-result.jsx';
import ServerDBClientInfoModal from './server-db-client-info-modal.jsx';

import { ResizableBox } from 'react-resizable';
require('./react-resizable.css');
require('./override-ace.css');


const QUERY_EDITOR_HEIGTH = 200;
const langTools = ace.acequire('ace/ext/language_tools');


const INFOS = {
  mysql: [
    'MySQL treats commented query as a non select query.' +
      'So you may see "affected rows" for a commented query.',
    'Usually executing a single query per tab will give better results.',
  ],
  sqlserver: [
    'MSSQL treats multiple non select queries as a single query result.' +
      'So you affected rows will show the amount over all queries executed in the same tab.',
    'Usually executing a single query per tab will give better results.',
  ],
};


const EVENT_KEYS = {
  onSelectionChange: 'changeSelection',
};


export default class Query extends Component {
  static propTypes = {
    widthOffset: PropTypes.number.isRequired,
    client: PropTypes.string.isRequired,
    allowCancel: PropTypes.bool.isRequired,
    query: PropTypes.object.isRequired,
    enabledAutoComplete: PropTypes.bool.isRequired,
    enabledLiveAutoComplete: PropTypes.bool.isRequired,
    databases: PropTypes.array,
    tables: PropTypes.array,
    columnsByTable: PropTypes.object,
    triggersByTable: PropTypes.object,
    indexesByTable: PropTypes.object,
    views: PropTypes.array,
    functions: PropTypes.array,
    procedures: PropTypes.array,
    onExecQueryClick: PropTypes.func.isRequired,
    onCancelQueryClick: PropTypes.func.isRequired,
    onCopyToClipboardClick: PropTypes.func.isRequired,
    onSaveToFileClick: PropTypes.func.isRequired,
    onSQLChange: PropTypes.func.isRequired,
    onSelectionChange: PropTypes.func.isRequired,
    editorName: PropTypes.string.isRequired,
  }

  constructor(props, context) {
    super(props, context);
    this.state = {};
  }

  componentDidMount() {
    this.refs.queryBoxTextarea.editor.on(
      EVENT_KEYS.onSelectionChange,
      debounce(::this.onSelectionChange, 100),
    );

    // init with the auto complete disabled
    this.refs.queryBoxTextarea.editor.completers = [];
    this.refs.queryBoxTextarea.editor.setOption('enableBasicAutocompletion', false);
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.enabledAutoComplete) {
      return;
    }

    const isMetadataChanged = (
      ((nextProps.tables || []).length !== (this.props.tables || []).length)
      || ((nextProps.views || []).length !== (this.props.views || []).length)
      || ((nextProps.functions || []).length !== (this.props.functions || []).length)
      || ((nextProps.procedures || []).length !== (this.props.procedures || []).length)
      || (Object.keys(nextProps.columnsByTable || {}).length
          !== Object.keys(this.props.columnsByTable || []).length)
      || (Object.keys(nextProps.triggersByTable || {}).length
          !== Object.keys(this.props.triggersByTable || []).length)
      || (Object.keys(nextProps.indexesByTable || {}).length
          !== Object.keys(this.props.indexesByTable || []).length)
    );

    if (!isMetadataChanged) {
      return;
    }

    const completions = this.getQueryCompletions(nextProps);

    const customCompleter = {
      getCompletions(editor, session, pos, prefix, callback) {
        callback(null, completions);
      },
    };

    // force load only the current available completers
    // discarding any previous existing completers
    this.refs.queryBoxTextarea.editor.completers = [
      langTools.snippetCompleter,
      langTools.textCompleter,
      langTools.keyWordCompleter,
      customCompleter,
    ];

    this.refs.queryBoxTextarea.editor.setOption(
      'enableBasicAutocompletion',
      true
    );

    this.refs.queryBoxTextarea.editor.setOption(
      'enableLiveAutocompletion',
      nextProps.enabledLiveAutoComplete
    );
  }

  componentDidUpdate() {
    if (this.props.query.isExecuting && this.props.query.isDefaultSelect) {
      this.refs.queryBoxTextarea.editor.focus();
      window.scrollTo(0, 0);
    }
  }

  componentWillUnmount() {
    this.refs.queryBoxTextarea.editor.removeListener(
      EVENT_KEYS.onSelectionChange,
      ::this.onSelectionChange,
    );
  }

  onSelectionChange() {
    this.props.onSelectionChange(
      this.props.query.query,
      this.refs.queryBoxTextarea.editor.getCopyText(),
    );
  }

  onExecQueryClick() {
    const query = this.refs.queryBoxTextarea.editor.getCopyText() || this.props.query.query;
    this.props.onExecQueryClick(query);
  }

  onDiscQueryClick() {
    this.props.onSQLChange('');
  }

  onCancelQueryClick() {
    this.props.onCancelQueryClick();
  }

  onShowInfoClick() {
    this.setState({ infoModalVisible: true });
  }

  onQueryBoxResize() {
    this.refs.queryBoxTextarea.editor.resize();
  }

  getQueryCompletions(props) {
    const {
      databases,
      schemas,
      tables,
      columnsByTable,
      triggersByTable,
      indexesByTable,
      views,
      functions,
      procedures,
    } = props;

    const mapCompletionTypes = (items, type) => {
      let result = items;
      if (!Array.isArray(items)) {
        result = Object.keys(items || {})
          .reduce((all, name) => all.concat(items[name]), []);
      }

      return (result || []).map(({ name }) => ({ name, type }));
    };

    return [
      ...mapCompletionTypes(databases, 'database'),
      ...mapCompletionTypes(schemas, 'schema'),
      ...mapCompletionTypes(tables, 'table'),
      ...mapCompletionTypes(columnsByTable, 'column'),
      ...mapCompletionTypes(triggersByTable, 'trigger'),
      ...mapCompletionTypes(indexesByTable, 'index'),
      ...mapCompletionTypes(views, 'view'),
      ...mapCompletionTypes(functions, 'function'),
      ...mapCompletionTypes(procedures, 'procedure'),
    ].map(({ name, type }) => ({ name, value: name, score: 1, meta: type }));
  }

  getCommands () {
    return [
      {
        name: 'increaseFontSize',
        bindKey: 'Ctrl-=|Ctrl-+',
        exec(editor) {
          const size = parseInt(editor.getFontSize(), 10) || 12;
          editor.setFontSize(size + 1);
        },
      },
      {
        name: 'decreaseFontSize',
        bindKey: 'Ctrl+-|Ctrl-_',
        exec(editor) {
          const size = parseInt(editor.getFontSize(), 10) || 12;
          editor.setFontSize(Math.max(size - 1 || 1));
        },
      },
      {
        name: 'resetFontSize',
        bindKey: 'Ctrl+0|Ctrl-Numpad0',
        exec(editor) {
          editor.setFontSize(12);
        },
      },
      {
        name: 'selectCurrentLine',
        bindKey: { win: 'Ctrl-L', mac: 'Command-L' },
        exec(editor) {
          const { row } = editor.selection.getCursor();
          const endColumn = editor.session.getLine(row).length;
          editor.selection.setSelectionRange({
            start: { column: 0, row },
            end: { column: endColumn, row },
          });
        },
      },
    ];
  }

  focus() {
    this.refs.queryBoxTextarea.editor.focus();
  }

  render() {
    const {
      widthOffset,
      client,
      query,
      onSaveToFileClick,
      onCopyToClipboardClick,
      onSQLChange,
      allowCancel,
    } = this.props;

    const infos = INFOS[client];

    return (
      <div>
        <div>
          <ResizableBox
            className="react-resizable react-resizable-se-resize ui segment"
            height={QUERY_EDITOR_HEIGTH}
            width={500}
            onResizeStop={::this.onQueryBoxResize}>
            <AceEditor
              mode="sql"
              theme="github"
              name={this.props.editorName}
              height="100%"
              width="100%"
              ref="queryBoxTextarea"
              value={query.query}
              showPrintMargin={false}
              commands={this.getCommands()}
              editorProps={{ $blockScrolling: Infinity }}
              onChange={debounce(onSQLChange, 50)}
              enableBasicAutocompletion
              enableLiveAutocompletion
              />
          </ResizableBox>
          <div className="ui secondary menu" style={{ marginTop: 0 }}>
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
                  {
                    query.isExecuting && allowCancel
                    ? (
                      <button
                        className={`ui negative button ${query.isCanceling ? 'loading' : ''}`}
                        onClick={::this.onCancelQueryClick}>Cancel</button>
                    )
                    : (
                      <button
                        className="ui button"
                        onClick={::this.onDiscQueryClick}>Discard</button>
                    )
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
        <QueryResult
          widthOffset={widthOffset}
          heigthOffset={QUERY_EDITOR_HEIGTH}
          onSaveToFileClick={onSaveToFileClick}
          onCopyToClipboardClick={onCopyToClipboardClick}
          resultItemsPerPage={query.resultItemsPerPage}
          copied={query.copied}
          saved={query.saved}
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
