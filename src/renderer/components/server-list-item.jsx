import React from 'react';
import PropTypes from 'prop-types';
import { requireClientLogo } from './require-context';
import { DB_CLIENTS } from '../api';

/**
 * Load icons for supported database clients
 */
const ICONS = DB_CLIENTS.reduce((clients, dbClient) => {
  /* eslint no-param-reassign:0 */
  clients[dbClient.key] = requireClientLogo(dbClient.key);
  return clients;
}, {});

const ServerListItem = ({ server, onConnectClick, onEditClick }) => (
  <div className="item">
    <div className="middle aligned content">
      <div className="left floated" style={{ padding: '1em' }}>
        <img alt="client" className="ui tiny image" style={{}} src={ICONS[server.client]} />
      </div>
      <div className="right floated">
        <div style={{ padding: '0 0 3em' }}>
          <button
            className="right floated circular ui icon button mini"
            onClick={() => onEditClick(server)}>
            <i className="icon pencil" />
          </button>
        </div>
        <div>
          <button
            className="ui button"
            tabIndex="0"
            onClick={() => onConnectClick(server)}
            style={{ verticalAlign: 'middle' }}>
            <div>
              <i className="plug icon" />
              Connect
            </div>
          </button>
        </div>
      </div>
      <div>
        <div className="header">{server.name}</div>
        <div className="meta" style={{ lineHeight: '1.5em', marginTop: '5px' }}>
          {server.host ? `${server.host}:${server.port}` : server.socketPath}
          {server.ssh && (
            <div>
              via
              {server.ssh.host}
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);

ServerListItem.propTypes = {
  server: PropTypes.object.isRequired,
  onConnectClick: PropTypes.func.isRequired,
  onEditClick: PropTypes.func.isRequired,
};

export default ServerListItem;
