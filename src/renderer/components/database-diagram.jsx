import React, { Component, PropTypes } from 'react';
import joint from 'jointjs';

require('./jointjs-diagram-table.js');
require('./jointjs-diagram-table-cell.js');
require('jointjs/dist/joint.min.css');


export default class DatabaseDiagram extends Component {
  static propTypes = {
    tables: PropTypes.array,
    columnsByTable: PropTypes.object,
    links: PropTypes.object,
  }

  constructor(props) {
    super(props);
    this.graph = new joint.dia.Graph();
  }

  componentDidMount() {
    const { tables, columnsByTable, links } = this.props;

    this.paper = new joint.dia.Paper({
      el: $(this.refs.diagram),
      width: $(this.refs.diagram).parent().width(),
      height: 600,
      model: this.graph,
      gridSize: 1,
      restrictTranslate: true,
    });

    const tableShapes = [];
    const tableCells = [];
    const tableLinks = [];

    try {
      let currentTable;
      let newTabCell;
      let newLink;

      /* Tables & views */
      tables.map((table, index) => {
        tableShapes.push(new joint.shapes.sqlectron.table({
          position: {
            x: 100 + (index % 6) * 100,
            y: 30 + (index % 4) * 100,
          },
          size: {
            width: 120,
            height: (columnsByTable[table].length + 1.5) * 20,
          },
          name: `${table}`,
        }));
        currentTable = tableShapes[index];

        columnsByTable[table].map((column, idx) => {
          newTabCell = new joint.shapes.sqlectron.tableCell({
            position: {
              x: (currentTable.position().x),
              y: (currentTable.position().y + (idx + 1) * 20),
            },
            size: {
              width: 100,
              height: 20,
            },
            name: `${column.name}`,
            tableName: `${table}`,
          });
          currentTable.embed(newTabCell);
          tableCells.push(newTabCell);
        });
      });

      /* Links */
      let targetIndex;

      tables.map((table, index) => {
        currentTable = tableShapes[index];

        links[table].map((target) => {
          targetIndex = tables.findIndex((t) => t === target.linksTo);
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
    } catch (e) {
      console.log(e);
    }

    /* Put everything on graph */
    this.graph.addCells(tableShapes.concat(tableCells, tableLinks));
    this.resizeTableElements(tableShapes);
  }


  // Resize table elements based on attributes text length
  resizeTableElements(tableShapes) {
    const { tables, columnsByTable } = this.props;

    tables.map((table) => {
      let biggestCellSize = $('span', `.sqlectron-table.${table} > p`).width();
      $('span', `.sqlectron-table-cell.${table}`).each(function() {
        if ( $(this).width() > biggestCellSize ) {
          biggestCellSize = $(this).width();
        }
      });

      if (biggestCellSize > 110) {
        tableShapes.find((shape) =>
          shape.attributes.name === table).resize(biggestCellSize + 20, (columnsByTable[table].length + 1.5) * 20);
      }
    });
  }

  render() {
    return <div ref="diagram"></div>;
  }
}
