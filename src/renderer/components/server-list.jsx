import React, { Component, PropTypes } from 'react';
import ServerListItem from './server-list-item.jsx';
import Message from './message.jsx';


require('./server-list.scss');


export default class ServerList extends Component {
  static propTypes = {
    servers: PropTypes.array.isRequired,
    onEditClick: PropTypes.func.isRequired,
    onConnectClick: PropTypes.func.isRequired,
  }

  groupItemsInRows(items) {
    const itemsPerRow = 4;
    return items.reduce((rows, item, index) => {
      const position = Math.floor(index / itemsPerRow);
      if (!rows[position]) {
        rows[position] = []; // eslint-disable-line no-param-reassign
      }

      rows[position].push(item);
      return rows;
    }, []);
  }

  render() {
    const { servers, onEditClick, onConnectClick } = this.props;

    if (!servers.length) {
      return <Message message="No results" type="info" />;
    }

    return (
      <div id="server-list">
        {this.groupItemsInRows(servers).map((row, rowIdx) =>
          <div key={rowIdx} className="ui cards">
            {row.map(server =>
              <ServerListItem
                key={server.id}
                onConnectClick={() => onConnectClick(server)}
                onEditClick={() => onEditClick(server)}
                server={server} />
            )}
          </div>
        )}
      </div>
    );
  }
}
