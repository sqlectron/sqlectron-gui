import React, { Component, PropTypes } from 'react';
import ValidatedComponent from 'utils/validated-component.jsx'
import ConnectionListItem from './connection-list-item.jsx';
import LoadingPage from './loading.jsx';
import List from '../widgets/list.jsx';
import { Link } from 'react-router';


export default class ConnectionList extends ValidatedComponent {
  constructor(props, context) {
    super(props, context);
    this.state = {
      connectionToDrop: {}
    }
  }

  static propTypes = {
    connections: PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired
  }

  componentDidMount() {
    const { actions } = this.props;
    actions.loadConnections();
  }

  onItemClick(connection) {
    this.setState({ connectionToDrop: connection });
  }

  render() {
    const { connections, actions } = this.props;
    console.info('[ConnectionList.jsx connections] ', this.props);
    const { connectionToDrop } = this.state;

    return connections.length > 0 ?
      <List>
        {connections.map((connection,i) =>
          <ConnectionListItem
            onClick={::this.onItemClick}
            key={i}
            connection={connection} />
        )}
      </List>
    : <LoadingPage />;
  }
};
