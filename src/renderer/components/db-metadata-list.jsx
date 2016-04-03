import React, { Component, PropTypes } from 'react';


export default class DbMetadataList extends Component {
  static propTypes = {
    tables: PropTypes.array.isRequired,
    views: PropTypes.array.isRequired,
    functions: PropTypes.array.isRequired,
    procedures: PropTypes.array.isRequired,
    database: PropTypes.object.isRequired,
    shouldShow: PropTypes.bool.isRequired,
    onSelectTable: PropTypes.func.isRequired,
  }

  constructor(props, context) {
    super(props, context);
    this.state = { Tables: true };
  }

  toggleListCollapse(toggledList) {
    const state = { ...this.state };
    if (!state[toggledList]) {
      state[toggledList] = true;
    } else {
      state[toggledList] = false;
    }
    this.setState(state);
  }

  renderListName(listName) {
    return (
      <span className="list-title"
        onClick={() => this.toggleListCollapse(listName)}>
        {listName}
      </span>
    );
  }

  renderListItems(listItems, listName, database) {
    const { onSelectTable } = this.props;
    const state = { ...this.state };

    if (state[listName] !== true) {
      return null;
    }

    if (!listItems.length) {
      return (
        <span className="ui grey item"><i> No results found</i></span>
      );
    }

    return listItems.map((item, idxChild) => {
      if(listName === 'Tables' || listName === 'Views') {
        return (
          <span key={idxChild}
            className="item list-item clickable"
            onDoubleClick={() => onSelectTable(database, item)}>
            {item.name}
          </span>
        );
      } else {
        return (
          <span key={idxChild}
            className="item list-item">
            {item.name}
          </span>
        );
      }
    });
  }

  render() {
    const { tables, views, functions, procedures, database, shouldShow } = this.props;
    if(!shouldShow) {
      return null;
    }

    return (
      <div>
        <div className="item">
          {this.renderListName('Tables')}
          {this.renderListItems(tables, 'Tables', database)}
        </div>
        <div className="item">
          {this.renderListName('Views')}
          {this.renderListItems(views, 'Views', database)}
        </div>
        <div className="item">
          {this.renderListName('Functions')}
          {this.renderListItems(functions, 'Functions')}
        </div>
        <div className="item">
          {this.renderListName('Procedures')}
          {this.renderListItems(procedures, 'Procedures')}
        </div>
      </div>
    );
  }
}
