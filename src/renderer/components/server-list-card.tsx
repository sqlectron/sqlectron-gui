import React, { FC } from 'react';
import { requireClientLogo } from './require-context';
import { DB_CLIENTS } from '../api';
import { Server } from '../../common/types/server';

/**
 * Load icons for supported database clients
 */
const ICONS = DB_CLIENTS.reduce((clients, dbClient) => {
  clients[dbClient.key] = requireClientLogo(dbClient.key);
  return clients;
}, {});

interface Props {
  server: Server;
  onConnectClick: () => void;
  onEditClick: () => void;
}

const ServerListCard: FC<Props> = ({ server, onConnectClick, onEditClick }) => (
  <div className="card">
    <div className="content">
      <div
        className="left floated"
        style={{ height: '35px', width: '35px', margin: '5px 10px 0 0' }}>
        <img
          alt="client"
          className="ui image"
          style={{ width: '100%' }}
          src={ICONS[server.client]}
        />
      </div>
      <button className="right floated circular ui icon button mini" onClick={onEditClick}>
        <i className="icon pencil" />
      </button>
      <div className="header">{server.name}</div>
      <div className="meta" style={{ lineHeight: '1.5em', marginTop: '5px', marginLeft: '45px' }}>
        {server.host ? `${server.host}:${server.port}` : server.socketPath}
        {server.ssh && (
          <div>
            via
            {server.ssh.host}
          </div>
        )}
      </div>
    </div>
    <div className="ui bottom attached button" tabIndex={0} onClick={onConnectClick}>
      <i className="plug icon" />
      Connect
    </div>
  </div>
);

ServerListCard.displayName = 'ServerListCard';

export default ServerListCard;
