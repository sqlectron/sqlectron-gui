import React, { Component, PropTypes } from 'react';
import joint from 'jointjs/dist/joint';
import './jointjs-diagram-table';
import './jointjs-diagram-table-cell';

require('jointjs/dist/joint.min.css');
require('./database-diagram.css');


export default class DatabaseDiagram extends Component {
  static propTypes = {
    tables: PropTypes.array,
    columnsByTable: PropTypes.object,
    tableKeys: PropTypes.object,
    diagramJSON: PropTypes.string,
    isSaving: PropTypes.bool,
    addRelatedTables: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {};
    this.graph = new joint.dia.Graph();
  }

  componentDidMount() {
    const { diagramJSON } = this.props;
    const tableShapes = [];
    const tableCells = [];
    const tableLinks = [];

    this.addGraphPaper();

    if ( diagramJSON ) {
      try {
        this.graph.fromJSON(JSON.parse(diagramJSON));
      } catch (error) {
        this.setState({ error: `Error while reading graph from file: ${error.message}` });
      }
      return;
    }

    // Generate graph if needed
    this.generateTableElements(tableShapes, tableCells);
    this.generateLinks(tableShapes, tableLinks);

    this.putEverythingOnGraph(tableShapes, tableCells, tableLinks);
  }

  addGraphPaper() {
    this.paper = new joint.dia.Paper({
      el: $(this.refs.diagram),
      width: $(this.refs.diagram).parent().width(),
      height: 600,
      model: this.graph,
      gridSize: 1,
      restrictTranslate: true,
    });

    if (!this.props.diagramJSON) { //Only supported for newely generated diagrams
      this.paper.on('cell:contextmenu',
        (cellView, evt, x, y) => {
          const table = cellView.model.attributes.name;
          this.onTableRightClick(table);
        }
      );
    }
  }

  generateTableElements(tableShapes, tableCells) {
    const { tables, columnsByTable, tableKeys } = this.props;
    let currentTable;
    let columnKey;
    let newTabCell;

    try {
      tables.map((table, index) => {
        tableShapes.push(new joint.shapes.sqlectron.Table({
          position: {
            x: 100 + (index % 6) * 100,
            y: 20 + (index % 4) * 100,
          },
          size: {
            width: 120,
            height: (columnsByTable[table].length + 1.5) * 20,
          },
          name: table,
        }));
        currentTable = tableShapes[index];

        columnsByTable[table].map((column, idx) => {
          columnKey = tableKeys[table].find((k) => k.columnName === column.name);

          newTabCell = new joint.shapes.sqlectron.TableCell({
            position: {
              x: (currentTable.position().x),
              y: ((currentTable.position().y + 7) + (idx + 1) * 20),
            },
            size: {
              width: 100,
              height: 20,
            },
            name: column.name,
            tableName: table,
            keyType: columnKey ? columnKey.keyType : null,
          });
          currentTable.embed(newTabCell);
          tableCells.push(newTabCell);
        });
      });
    } catch (error) {
      this.setState({ error: `Error while generating table elements: ${error.message}` });
    }
  }

  generateLinks(tableShapes, tableLinks) {
    const { tables, tableKeys } = this.props;
    let currentTable;
    let newLink;
    let targetIndex;

    try {
      tables.map((table, index) => {
        currentTable = tableShapes[index];

        tableKeys[table].map((target) => {
          targetIndex = tables.findIndex((t) => t === target.referencedTable);
          if (targetIndex !== -1) {
            newLink = new joint.dia.Link({
              source: { id: currentTable.id },
              target: { id: tableShapes[targetIndex].id },
            });
            newLink.attr({'.marker-target': { fill: 'yellow', d: 'M 10 0 L 0 5 L 10 10 z' }});
            tableLinks.push(newLink);
          }
        });
      });
    } catch (error) {
      this.setState({ error: `Error while generating links: ${error.message}` });
    }
  }

  putEverythingOnGraph(tableShapes, tableCells, tableLinks) {
    this.graph.addCells(tableShapes.concat(tableCells, tableLinks));
    this.resizeTableElements(tableShapes, tableCells);
  }


  // Resize table elements based on attributes text length
  resizeTableElements(tableShapes, tableCells) {
    const { tables, columnsByTable } = this.props;

    tables.map((table) => {
      let biggestCellSize = $('span', `.sqlectron-table.${table} > p`).outerWidth();
      $('span', `.sqlectron-table-cell.${table}`).each(function() {
        if ( $(this).outerWidth()  > biggestCellSize ) {
          biggestCellSize = $(this).outerWidth();
        }
      });

      if (biggestCellSize > 100) {
        // resize tables
        tableShapes.find((shape) => shape.attributes.name === table)
          .resize( biggestCellSize + 20, (columnsByTable[table].length + 1.5) * 20 );
        // resize table cells
        tableCells.filter((cell) => cell.attributes.tableName === table)
          .map((cell) => cell.resize( biggestCellSize, 20 ));
      }
    });
  }

  shouldDisableDiagram() {
    const { isSaving } = this.props;
    return isSaving
      ? { pointerEvents: 'none' }
      : { pointerEvents: 'auto' };
  }

  onTableRightClick(table) {
    const { tableKeys, addRelatedTables } = this.props;
    const relatedTables = tableKeys[table].map(k => k.referencedTable).filter(rt => rt !== null);
    addRelatedTables(relatedTables);
  }

  render() {
    if (!!this.state.error) {
      return <div className="ui negative message" style={{textAlign: 'center'}}>{this.state.error}</div>;
    }

    return <div ref="diagram" style={this.shouldDisableDiagram()}></div>;
  }
}
