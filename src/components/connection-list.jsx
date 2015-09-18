import React, { Component, PropTypes } from 'react';
import ConnectionListItem from './connection-list-item.jsx';
import LoadingPage from './loading.jsx';
import { Link } from 'react-router';


export default class ConnectionList extends Component {
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
    const { connectionToDrop } = this.state;

    return connections.length > 0 ?
      <ul>
        {connections.map((connection,i) =>
          <ConnectionListItem
            onClick={::this.onItemClick}
            key={i}
            connection={connection} />
        )}
      </ul>
    : <LoadingPage />;
  }
};
