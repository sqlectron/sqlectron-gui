import React, { FC } from 'react';
import { requireClientLogo } from './require-context';
import { DB_CLIENTS } from '../api';
import { Server } from '../../common/types/server';

/**
 * Load icons for supported database clients
 */
const ICONS = DB_CLIENTS.reduce((clients, dbClient) => {
  /* eslint no-param-reassign:0 */
  clients[dbClient.key] = requireClientLogo(dbClient.key);
  return clients;
}, {});

interface Props {
  server: Server;
  onConnectClick: () => void;
  onEditClick: () => void;
}

const ServerListItem: FC<Props> = ({ server, onConnectClick, onEditClick }) => (
  <div className="item">
    <div className="middle aligned content">
      <div className="left floated" style={{ padding: '1em' }}>
        <img alt="client" className="ui tiny image" style={{}} src={ICONS[server.client]} />
      </div>
      <div className="right floated">
        <div style={{ padding: '0 0 3em' }}>
          <button className="right floated circular ui icon button mini" onClick={onEditClick}>
            <i className="icon pencil" />
          </button>
        </div>
        <div>
          <button
            className="ui button"
            tabIndex={0}
            onClick={onConnectClick}
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
          {server.ssh && <div>via {server.ssh.host}</div>}
        </div>
      </div>
    </div>
  </div>
);

ServerListItem.displayName = 'ServerListItem';

export default ServerListItem;
