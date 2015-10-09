import React, { Component, PropTypes } from 'react';
import ServerListItem from './server-list-item.jsx';
import LoadingPage from './loading.jsx';
import { Link } from 'react-router';


export default class ServerList extends Component {
  constructor(props, context) {
    super(props, context);
  }

  static propTypes = {
    servers: PropTypes.array.isRequired,
    onEditClick: PropTypes.func.isRequired,
    onConnectClick: PropTypes.func.isRequired,
  }

  render() {
    const { servers, onEditClick, onConnectClick } = this.props;

    return servers.length > 0 ?
    <div className="ui grid">
      <div className="row">
        <div className="wide column">
          <div className="ui cards">
            {servers.map((server,i) =>
              <ServerListItem
                key={i}
                onConnectClick={onConnectClick}
                onEditClick={() => onEditClick(i) }
                server={server} />
            )}
          </div>
        </div>
      </div>
    </div>
    : <LoadingPage />;
  }
};
