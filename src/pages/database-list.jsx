import React, { Component, PropTypes } from 'react';
import ValidatedComponent from 'utils/validated-component.jsx'
import LoadingPage from './loading.jsx';
import { Link } from 'react-router';


export default class DatabaseList extends ValidatedComponent {
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
        <div className="item">
          <i className="grid database icon"></i> {database.name}
          <div className="menu">
            {database.tables.map(table => <a className="item">{table}</a>)}
          </div>
        </div>
      )}
    </div>);
  }
};
