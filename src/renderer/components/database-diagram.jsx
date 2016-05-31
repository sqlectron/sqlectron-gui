import React, { Component, PropTypes } from 'react';
import joint from 'jointjs';
import debounce from 'lodash';

require('./jointjs-diagram-table.js');
require('./jointjs-diagram-table-cell.js');
require('jointjs/dist/joint.min.css');


export default class DatabaseDiagram extends Component {
  static propTypes = {
    tables: PropTypes.array,
    views: PropTypes.array,
    columnsByTable: PropTypes.object,
  }

  constructor(props) {
    super(props);
    this.graph = new joint.dia.Graph();
  }

  componentDidMount() {
    const { tables, views, columnsByTable } = this.props;

    this.paper = new joint.dia.Paper({
      el: $(this.refs.diagram),
      width: $(this.refs.diagram).parent().width(),
      height: 600,
      model: this.graph,
      gridSize: 1,
    });

    let tableShapes = [],
        tableCells = [],
        tableLinks = [];

    /* Tables & views */
    const inTables = tables.concat(views);
    try {
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
        let currentTable = tableShapes[index];
        let newTabCell;

        columnsByTable[table.name].map((column, index) => {
          newTabCell = new joint.shapes.sqlectron.tableCell({
            position: {
              x: (currentTable.position().x),
              y: (currentTable.position().y + (index + 1) * 20)
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
    } catch (e) {
      console.log(e);
    }

    /* TODO: Links

    Ex:

    inTables.map((table, index) => {
      if (!table.linksTo){
        return;
      }

      let targetIndex;
      table.linksTo.map(target => {
        targetIndex = inTables.findIndex((table) => table.name === target);
        tableLinks.push(new joint.dia.Link({
          source: { id: tableShapes[index].id },
          target: { id: tableShapes[targetIndex].id }
        }));
      });
    });
    */

    /* Put everything on graph */
    this.graph.addCells(tableShapes.concat(tableCells, tableLinks));
  }

  render() {
    return <div ref="diagram"></div>;
  }
}
