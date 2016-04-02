import React, { Component, PropTypes } from 'react';


export default class RoutineList extends Component {
  static propTypes = {
    functions: PropTypes.array.isRequired,
    procedures: PropTypes.array.isRequired,
    shouldShow: PropTypes.bool.isRequired,
  }

  constructor(props, context) {
    super(props, context);
    this.state = {};
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

  renderListItems(listItems, listName) {
    const state = { ...this.state };

    if (state[listName] !== true) {
      return null;
    }

    return listItems.map((item, idxChild) => {
      return (
        <span key={idxChild}
          className="item list-item">
          {item.name}
        </span>
      );
    });
  }

  render() {
    const { functions, procedures, shouldShow } = this.props;
    if (!shouldShow) {
      return null;
    }

    return (
      <div>
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
