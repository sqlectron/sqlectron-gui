import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';


export default class ServerAdd extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      visible: false,
      selectedSSH: false
    }
  }

  static propTypes = {
    visible: PropTypes.bool.isRequired,
    actions: PropTypes.object.isRequired
  }

  componentDidUpdate() {
    const { visible } = this.props;
    if (visible) {
      $(ReactDOM.findDOMNode(this.refs.serverModal)).modal('show');
    }
  }

  componentDidMount() {
    $(ReactDOM.findDOMNode(this.refs.serverModal)).modal({
      closable: false,
      detachable: false,
      onDeny: () => {
        // TODO: validation
        return true;
      },
      onApprove: () => {
        // TODO: validation, save
      }
    });
    $(ReactDOM.findDOMNode(this.refs.clientList)).dropdown();
    $(ReactDOM.findDOMNode(this.refs.sshTunnel)).checkbox({
      onChecked: () => this.setState({ selectedSSH: true }),
      onUnchecked: () => this.setState({ selectedSSH: false })
    });
  }

  render() {
    const { selectedSSH } = this.state;

    return (
      <div className="ui modal" ref="serverModal">
        <i className="close icon"></i>
        <div className="header">
          Server Information
        </div>
        <div className="content">
          <form className="ui form">
            <div className="fields">
              <div className="ten wide field">
                <label>Name</label>
                <input type="text" name="name" placeholder="Name" />
              </div>
              <div className="six wide field">
                <label>Client</label>
                <div className="ui fluid search selection dropdown" ref="clientList">
                  <input type="hidden" name="client" />
                  <i className="dropdown icon"></i>
                  <div className="default text">Select Client</div>
                  <div className="menu">
                    <div className="item" data-value="af"><img src="https://www.mysql.com/common/logos/logo-mysql-170x115.png" style={{width: '16px'}} /> MySQL</div>
                    <div className="item" data-value="ax"><img src="https://wiki.postgresql.org/images/3/30/PostgreSQL_logo.3colors.120x120.png" style={{width: '16px'}} /> PostgreSQL</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="field">
              <label>Server Address</label>
              <div className="fields">
                <div className="seven wide field">
                  <input type="text" name="host" placeholder="Host" />
                </div>
                <div className="three wide field">
                  <input type="text" name="port" placeholder="Port" />
                </div>
                <div className="six wide field">
                  <input type="text" name="socketPath" placeholder="Unix socket path" />
                </div>
              </div>
            </div>
            <div className="fields">
              <div className="five wide field">
                <label>User</label>
                <input type="text" name="user" maxLength="3" placeholder="User" />
              </div>
              <div className="five wide field">
                <label>Password</label>
                <input type="password" name="password" maxLength="3" placeholder="Password" />
              </div>
              <div className="six wide field">
                <label>Database</label>
                <input type="text" name="database" maxLength="16" placeholder="Database" />
              </div>
            </div>
             <div className="ui segment">
              <div className="one field">
                <div className="ui toggle checkbox" ref="sshTunnel">
                  <input type="checkbox" name="sshTunnel" tabIndex="0" className="hidden" />
                  <label>SSH Tunnel</label>
                </div>
              </div>
              <div className="field">
                <label>SSH Address</label>
                <div className="fields">
                  <div className="seven wide field">
                    <input type="text" name="ssh[host]" placeholder="Host" disabled={!selectedSSH} />
                  </div>
                  <div className="three wide field">
                    <input type="text" name="ssh[port]" placeholder="Port" disabled={!selectedSSH} />
                  </div>
                </div>
              </div>
              <div className="fields">
                <div className="five wide field">
                  <label>User</label>
                  <input type="text" name="ssh[user]" maxLength="3" placeholder="User" disabled={!selectedSSH} />
                </div>
                <div className="five wide field">
                  <label>Password</label>
                  <input type="password" name="ssh[password]" maxLength="3" placeholder="Password" disabled={!selectedSSH} />
                </div>
                <div className="six wide field">
                  <label>Private Key</label>
                  <input type="text" name="ssh[privateKey]" maxLength="16" placeholder="~/.ssh/id_rsa" disabled={!selectedSSH} />
                </div>
              </div>
            </div>
          </form>
        </div>
        <div className="actions">
          <div className="ui black deny button">
            Cancel
          </div>
          <div className="ui positive right labeled icon button">
            Save
            <i className="checkmark icon"></i>
          </div>
        </div>
      </div>
    );
  }
};
