import React, { Component, PropTypes } from 'react';
import LoadingPage from './loading.jsx';


export default class DatabaseList extends Component {
  static propTypes = {
    databases: PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired,
  }

  constructor(props, context) {
    super(props, context);
    this.state = {
      databaseToDrop: {},
    };
  }

  componentDidMount() {
    const { actions } = this.props;
    actions.loadDatabases();
  }

  render() {
    const { databases } = this.props;
    if (!databases.length) { return <LoadingPage />; }

    return (<div>
      {databases.map((database, idx) =>
        <div className="item" key={idx} style={{display: database.visible ? 'block' : 'none'}}>
          <i className="grid database icon"></i> {database.name}
          <div className="menu">
            {database.tables.map((table, idxChild) => {
              return (
                <a key={idxChild}
                  className="item"
                  style={{textDecoration: table.visible ? 'none' : 'line-through'}}>
                  {table.name}
                </a>
              );
            })}
          </div>
        </div>
      )}
    </div>);
  }
}
