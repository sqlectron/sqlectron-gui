import React, { Component, PropTypes } from 'react';
import LoadingPage from './loading.jsx';
import { Link } from 'react-router';


export default class DatabaseList extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      databaseToDrop: {}
    }
  }

  static propTypes = {
    databases: PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired
  }

  componentDidMount() {
    const { actions } = this.props;
    actions.loadDatabases();
  }

  render() {
    const { databases, actions } = this.props;
    if (!databases.length) { return <LoadingPage />; }

    return (<div>
      {databases.map((database,i) =>
        <div className="item" key={i} style={{display: database.visible ? 'block' : 'none'}}>
          <i className="grid database icon"></i> {database.name}
          <div className="menu">
            {database.tables.map((table,k) => {
              return <a key={k} className="item" style={{textDecoration: table.visible ? 'none' : 'line-through'}}>{table.name}</a>
            })}
          </div>
        </div>
      )}
    </div>);
  }
};
