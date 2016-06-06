import React, { Component, PropTypes } from 'react';
import DatabaseDiagram from './database-diagram.jsx';
import Loader from './loader.jsx';

const STYLE = {
  list: { maxHeight: '250px', overflow: 'hidden', overflowY: 'scroll', padding: '8px', border: '2px solid' },
};


export default class DatabaseDiagramModal extends Component {
  static propTypes = {
    database: PropTypes.string,
    tables: PropTypes.array,
    selectedTables: PropTypes.array,
    views: PropTypes.array,
    columnsByTable: PropTypes.object,
    references: PropTypes.object,
    onShowDatabaseDiagram: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
  }

  constructor(props, context) {
    super(props, context);
    this.state = {};
  }

  componentDidMount() {
    $(this.refs.diagramModal).modal({
      closable: true,
      detachable: false,
      // Updates modal position on loading diagram in modal DOM
      observeChanges: true,
      onHidden: () => {
        this.props.onClose();
      },
    }).modal('show');
  }

  componentWillReceiveProps(nextProps) {
    this.showDiagramIfNeeded(nextProps);
  }

  onSelectAllTables() {
    $(':checkbox', 'div.ui.list').prop('checked', true);
    this.onCheckBoxesChange();
  }

  onDeselectAllTables() {
    $(':checkbox', 'div.ui.list').prop('checked', false);
    this.onCheckBoxesChange();
  }

  onCheckBoxesChange() {
    // Disable generate diagram button if there are no tables selected
    return $(':checkbox:checked', 'div.ui.list').length
      ? $(this.refs.generateButton).removeClass('disabled')
      : $(this.refs.generateButton).addClass('disabled');
  }

  onGenerateDiagramClick() {
    this.setState({ showLoader: true });
    this.props.onShowDatabaseDiagram(this.props.database);
  }

  showDiagramIfNeeded(props) {
    if (this.isDataLoaded(props)) {
      this.setState({ showDatabaseDiagram: true });
    }
  }

  isDataLoaded(props) {
    const { selectedTables, columnsByTable, references } = props;

    return (selectedTables
      && columnsByTable
      && references
      && selectedTables.every((t) => Object.keys(columnsByTable).includes(t))
      && selectedTables.every((t) => Object.keys(references).includes(t))
    );
  }

  renderSelectTablesMenu() {
    const { tables, views } = this.props;
    const tablesAndViews = tables.concat(views);

    return (
      <div className="content" style={{minHeight: '300px'}}>
        <h4 className="ui horizontal divider header">
          <i className="list icon"></i>
          Select tables to include on diagram
        </h4>
        <div style={{ margin: '0 33% 0 33%' }}>
          <div className="ui mini buttons">
            <button className="ui button mini" onClick={::this.onSelectAllTables}>
              Select All
            </button>
            <div className="or"></div>
            <button className="ui button mini" onClick={::this.onDeselectAllTables}>
              Deselect All
            </button>
          </div>
          <div className="ui list" style={STYLE.list}>
            {tablesAndViews.map((item) =>
              <div key={item.name} className="item">
                <div className="ui checkbox">
                  <input id={item.name} type="checkbox" onChange={::this.onCheckBoxesChange}/>
                  <label>{item.name}</label>
                </div>
              </div>
            )}
          </div>
          <button
            ref="generateButton"
            className="ui right floated positive button disabled"
            style={{marginBottom: '1em'}}
            onClick={::this.onGenerateDiagramClick}>
            Generate diagram
          </button>
        </div>
      </div>
    );
  }

  renderLoader() {
    return (
      <div style={{minHeight: '300px'}}>
        <Loader message="Generating diagram" type="active" inverted />
      </div>
    );
  }

  renderDiagram() {
    const { selectedTables, columnsByTable, references } = this.props;

    return (
      <DatabaseDiagram
        tables={selectedTables}
        columnsByTable={columnsByTable}
        links={references} />
    );
  }

  render() {
    // Modal has to be in DOM before rendering diagram because of JointJS getBBox() method.
    // On first rendering, if context node is hidden, wrong widths and heights of JointJS
    // elements will be calculated.
    // For more check this issue: https://github.com/clientIO/joint/issues/262
    return (
      <div className="ui modal" ref="diagramModal">
        {!this.state.showDatabaseDiagram && !this.state.showLoader && this.renderSelectTablesMenu()}
        {!this.state.showDatabaseDiagram && !!this.state.showLoader && this.renderLoader()}
        {!!this.state.showDatabaseDiagram && this.renderDiagram()}
      </div>
    );
  }
}
