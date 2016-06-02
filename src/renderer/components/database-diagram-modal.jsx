import React, { Component, PropTypes } from 'react';
import DatabaseDiagram from './database-diagram.jsx';


export default class DatabaseDiagramModal extends Component {
  static propTypes = {
    tables: PropTypes.array,
    views: PropTypes.array,
    columnsByTable: PropTypes.object,
    references: PropTypes.object,
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
        this.setState({ showDiagramModal: false });
        this.props.onClose();
      },
    });

    // Force showing diagram on initial mount if everything was fetched before
    this.showDiagramIfNeeded(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.showDiagramIfNeeded(nextProps);
  }

  isDataLoaded(props) {
    const { tables, views, columnsByTable, references } = props;
    const tablesAndViews = tables.concat(views);

    return (tablesAndViews
      && columnsByTable
      && references
      && tablesAndViews.length === Object.keys(columnsByTable).length
      && tables.length === Object.keys(references).length
    );
  }

  showDiagramIfNeeded(props) {
    if (this.isDataLoaded(props)) {
      this.setState({ showDiagramModal: true });
      $(this.refs.diagramModal).modal('show');
    }
  }

  renderDiagram() {
    const { tables, views, columnsByTable, references } = this.props;

    return (
      <DatabaseDiagram
        tables={tables}
        views={views}
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
        {!!this.state.showDiagramModal && this.renderDiagram()}
      </div>
    );
  }
}
