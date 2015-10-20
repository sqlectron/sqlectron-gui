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

  groupItemsInRows(items) {
    const itemsPerRow = 4;
    return items.filter(item => item.visible).reduce((rows, item, index) => {
      const position = Math.floor(index / itemsPerRow);
      if (rows[position]) {
        rows[position].push(item);
      } else {
        rows[position] = [item];
      }
      return rows;
    }, []);
  }

  render() {
    const { servers, onEditClick, onConnectClick } = this.props;

    if (!servers.length) {
      return <LoadingPage />;
    }

    return (
      <div className="ui grid">
        {this.groupItemsInRows(servers).map((row, rowIdx) =>
          <div key={rowIdx} className="doubling four column row">
            {row.map((server, idx) =>
              <div key={idx} className="wide column">
                <div className="ui">
                  <ServerListItem
                    onConnectClick={onConnectClick}
                    onEditClick={() => onEditClick(idx) }
                    server={server} />
                  </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}
