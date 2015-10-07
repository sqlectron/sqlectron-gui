import React, { Component, PropTypes } from 'react';
import ServerListItem from './server-list-item.jsx';
import LoadingPage from './loading.jsx';
import { Link } from 'react-router';


export default class ServerList extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      serverToDrop: {}
    }
  }

  static propTypes = {
    servers: PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired,
    onConnectClick: PropTypes.func.isRequired, // for parent
  }

  componentDidMount() {
    const { actions } = this.props;
    actions.loadServers();
  }

  onAddClick(server) {
    const { actions } = this.props;
    actions.openAddServers();
  }

  render() {
    const { servers, actions, onConnectClick } = this.props;
    const { serverToDrop } = this.state;

    return servers.length > 0 ?
    <div className="ui grid">
      <div className="row">
        <div className="column">
          <button className="ui button" onClick={::this.onAddClick}>
            Add
          </button>
        </div>
      </div>
      <div className="row">
        <div className="wide column">
          <div className="ui cards">
            {servers.map((server,i) =>
              <ServerListItem
                onConnectClick={onConnectClick}
                key={i}
                server={server} />
            )}
          </div>
        </div>
      </div>
    </div>
    : <LoadingPage />;
  }
};
