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
    tableKeys: PropTypes.object,
    diagramJSON: PropTypes.string,
    isSaving: PropTypes.bool,
    onGenerateDatabaseDiagram: PropTypes.func.isRequired,
    addRelatedTables: PropTypes.func.isRequired,
    onSaveDatabaseDiagram: PropTypes.func.isRequired,
    onExportDatabaseDiagram: PropTypes.func.isRequired,
    onOpenDatabaseDiagram: PropTypes.func.isRequired,
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
      onApprove: () => false,
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
    this.props.onGenerateDatabaseDiagram(this.props.database);
  }

  onAddRelatedTables(relatedTables) {
    const { selectedTables, addRelatedTables } = this.props;

    // If all related tables are already on diagram -> no need to reset positions
    if (relatedTables.every(t => selectedTables.includes(t))) {
      return;
    }

    this.setState({  showDatabaseDiagram: false });
    addRelatedTables(relatedTables);
  }

  onExportDatabaseDiagram(imageType) {
    const { onExportDatabaseDiagram } = this.props;
    const diagram = this.refs.databaseDiagram.refs.diagram;

    // fix - reapply css roles which html2canvas ignores for some reason
    $('.link-tools, .marker-arrowheads', diagram).css({ display: 'none' });
    $('.link, .connection', diagram).css({ fill: 'none' });

    onExportDatabaseDiagram(diagram, imageType);
  }

  showDiagramIfNeeded(props) {
    if (this.isDataLoaded(props) || props.diagramJSON) {
      this.setState({ showDatabaseDiagram: true });
    }
  }

  isDataLoaded(props) {
    const { selectedTables, columnsByTable, tableKeys } = props;

    return (selectedTables
      && columnsByTable
      && tableKeys
      && selectedTables.every((t) => Object.keys(columnsByTable).includes(t))
      && selectedTables.every((t) => Object.keys(tableKeys).includes(t))
    );
  }

  renderSelectTablesMenu() {
    const { tables, views, onOpenDatabaseDiagram } = this.props;
    const tablesAndViews = tables.concat(views);

    return (
      <div className="content">
        <div className="ui middle aligned padded very relaxed stackable grid" >
          <div className="ten wide column">
            <h4 className="ui horizontal divider header">
              <i className="list icon"></i>
              Select tables to include on diagram
            </h4>
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
          <div className="ui vertical divider">
            Or
          </div>
          <div className="six wide center aligned column">
            <button
              className="fluid ui blue labeled icon button"
              onClick={() => onOpenDatabaseDiagram()}>
              <i className="folder open outline icon"></i>
              Open diagram from file
            </button>
          </div>
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
    const {
      selectedTables,
      columnsByTable,
      tableKeys,
      diagramJSON,
      isSaving,
      onAddRelatedTables,
    } = this.props;

    return (
      <DatabaseDiagram
        ref="databaseDiagram"
        tables={selectedTables}
        columnsByTable={columnsByTable}
        tableKeys={tableKeys}
        diagramJSON={diagramJSON}
        isSaving={isSaving}
        addRelatedTables={::this.onAddRelatedTables} />
    );
  }

  renderActionButtons() {
    const { onSaveDatabaseDiagram } = this.props;

    return (
      <div className="actions">
        <div className="ui buttons">
          <div className="ui small positive button"
            tabIndex="0"
            onClick={() => onSaveDatabaseDiagram(this.refs.databaseDiagram.graph.toJSON())}>
            Save
          </div>
          <div className="or"></div>
          <div className="ui small right labeled icon button simple upward dropdown">
            Export to
            <i className="caret up icon"></i>
            <div className="menu">
              <div className="item"
                onClick={() => this.onExportDatabaseDiagram('png')}>
                PNG
              </div>
              <div className="item"
                onClick={() => this.onExportDatabaseDiagram('jpeg')}>
                JPEG
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  render() {
    // Modal has to be in DOM before rendering diagram because of JointJS getBBox() method.
    // On first rendering, if context node is hidden, wrong widths and heights of JointJS
    // elements will be calculated.
    // For more check this issue: https://github.com/clientIO/joint/issues/262
    return (
      <div className="ui modal" ref="diagramModal">
        {!!this.state.showDatabaseDiagram &&
          <div className="header">
            Database diagram
          </div>
        }
        <div className="content">
          {!this.state.showDatabaseDiagram && !this.state.showLoader && this.renderSelectTablesMenu()}
          {!this.state.showDatabaseDiagram && !!this.state.showLoader && this.renderLoader()}
          {!!this.state.showDatabaseDiagram && this.renderDiagram()}
        </div>
        {!!this.state.showDatabaseDiagram && this.renderActionButtons()}
      </div>
    );
  }
}
