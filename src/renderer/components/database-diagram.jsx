import React, { Component, PropTypes } from 'react';
import joint from 'jointjs';

require('./jointjs-diagram-table.js');
require('./jointjs-diagram-table-cell.js');
require('jointjs/dist/joint.min.css');


export default class DatabaseDiagram extends Component {
  static propTypes = {
    tables: PropTypes.array,
    views: PropTypes.array,
    columnsByTable: PropTypes.object,
    links: PropTypes.object,
  }

  constructor(props) {
    super(props);
    this.graph = new joint.dia.Graph();
  }

  componentDidMount() {
    const { tables, views, columnsByTable, links } = this.props;

    this.paper = new joint.dia.Paper({
      el: $(this.refs.diagram),
      width: $(this.refs.diagram).parent().width(),
      height: 600,
      model: this.graph,
      gridSize: 1,
    });

    const tableShapes = [];
    const tableCells = [];
    const tableLinks = [];

    const inTables = tables.concat(views);

    try {
      let currentTable;
      let newTabCell;
      let newLink;

      /* Tables & views */
      inTables.map((table, index) => {
        tableShapes.push(new joint.shapes.sqlectron.table({
          position: {
            x: 100 + (index % 6) * 100,
            y: 30 + (index % 4) * 100,
          },
          size: {
            width: 120,
            height: (columnsByTable[table.name].length + 1.5) * 20,
          },
          name: `${table.name}`,
        }));
        currentTable = tableShapes[index];

        columnsByTable[table.name].map((column, idx) => {
          newTabCell = new joint.shapes.sqlectron.tableCell({
            position: {
              x: (currentTable.position().x),
              y: (currentTable.position().y + (idx + 1) * 20),
            },
            size: {
              width: 60,
              height: 20,
            },
            name: `${column.name}`,
          });
          currentTable.embed(newTabCell);
          tableCells.push(newTabCell);
        });
      });

      /* Links */
      let targetIndex;

      tables.map((table, index) => {
        currentTable = tableShapes[index];

        links[table.name].map((target) => {
          targetIndex = inTables.findIndex((t) => t.name === target.linksTo);
          newLink = new joint.dia.Link({
            source: { id: currentTable.id },
            target: { id: tableShapes[targetIndex].id },
          });
          newLink.attr({'.marker-target': { fill: 'yellow', d: 'M 10 0 L 0 5 L 10 10 z' }});
          tableLinks.push(newLink);
        });
      });
    } catch (e) {
      console.log(e);
    }

    /* Put everything on graph */
    this.graph.addCells(tableShapes.concat(tableCells, tableLinks));
  }

  render() {
    return <div ref="diagram"></div>;
  }
}
