import React, { Component, PropTypes } from 'react';
import { sqlectron } from '../../browser/remote';


const CLIENTS = sqlectron.db.CLIENTS.map(dbClient => ({
  key: dbClient.key,
  name: dbClient.name,
}));


export default class ServerDBClientInfoModal extends Component {
  static propTypes = {
    client: PropTypes.string.isRequired,
    infos: PropTypes.array.isRequired,
    onCloseClick: PropTypes.func.isRequired,
  }

  componentDidMount() {
    $(this.refs.infoModal).modal({
      closable: true,
      detachable: false,
      allowMultiple: true,
      observeChanges: true,
      onHidden: () => this.props.onCloseClick(),
    }).modal('show');
  }

  componentWillUnmount() {
    $(this.refs.infoModal).modal('hide');
  }

  render() {
    const { client, infos } = this.props;
    const dbClient = CLIENTS.find(item => item.key === client);

    return (
      <div id="server-modal" className="ui modal" ref="infoModal">
        <div className="header">
          {dbClient.name} Query Information
        </div>
        <div className="content">
          <p>Some particularities about queries on {dbClient.name} you should know:</p>
          <div className="ui bulleted list">
            {infos.map((info, idx) => (<div key={idx} className="item">{info}</div>))}
          </div>
          <ul>
          </ul>
        </div>
      </div>
    );
  }
}
