import React, { Component, PropTypes } from 'react';


export default class ViewList extends Component {
  static propTypes = {
    views: PropTypes.array.isRequired,
    database: PropTypes.object.isRequired,
    dbIsToggled: PropTypes.bool.isRequired,
    hasNoTables: PropTypes.bool.isRequired,
    onSelectView: PropTypes.func.isRequired,
  }

  constructor(props, context) {
    super(props, context);
    this.state = {};
  }

  toggleViewCollapse(database) {
    const state = { ...this.state };
    if (!state[database.name]) {
      state[database.name] = true;
    } else {
      state[database.name] = false;
    }
    this.setState(state);
  }

  renderTitle(database) {
    const { dbIsToggled, hasNoTables } = this.props;
    if (hasNoTables || !dbIsToggled) {
      return null;
    }

    return (
      <span className="list-title"
        onClick={() => this.toggleViewCollapse(database)}>
        Views
      </span>
    );
  }

  renderViews(database, views) {
    const { onSelectView } = this.props;
    console.log('ok');
    return views.map((view, idxChild) => {
      return (
        <span key={idxChild}
          className="item list-item"
          onDoubleClick={() => onSelectView(database, view)}>
          {view.name}
        </span>
      );
    });
  }

  render() {
    const { database, views } = this.props;
    const state = { ...this.state };

    if (state[database.name] !== true) {
      return (
        <div className="item">
          {this.renderTitle(database)}
        </div>
      );
    }

    return (
      <div className="item">
        {this.renderTitle(database)}
        {this.renderViews(database, views)}
      </div>
    );
  }
}
