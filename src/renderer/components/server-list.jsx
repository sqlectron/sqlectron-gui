import React, { Component, PropTypes } from 'react';
import ServerListItem from './server-list-item.jsx';
import LoadingPage from './loading.jsx';


export default class ServerList extends Component {
  static propTypes = {
    servers: PropTypes.array.isRequired,
    onEditClick: PropTypes.func.isRequired,
    onConnectClick: PropTypes.func.isRequired,
  }

  constructor(props, context) {
    super(props, context);
  }

  render() {
    const { servers, onEditClick, onConnectClick } = this.props;

    return servers.length > 0 ?
    <div className="ui grid">
      <div className="row">
        <div className="wide column">
          <div className="ui cards">
            {servers.map((server, idx) =>
              server.visible && <ServerListItem
                key={idx}
                onConnectClick={onConnectClick}
                onEditClick={() => onEditClick(idx) }
                server={server} />
            )}
          </div>
        </div>
      </div>
    </div>
    : <LoadingPage />;
  }
}
