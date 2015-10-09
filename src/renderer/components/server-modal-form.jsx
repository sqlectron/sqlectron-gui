import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';


export default class ServerModalForm extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {};
  }

  static propTypes = {
    visible: PropTypes.bool.isRequired,
    onSaveClick: PropTypes.func.isRequired,
    onCancelClick: PropTypes.func.isRequired,
    server: PropTypes.object,
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.visible) {
      $(ReactDOM.findDOMNode(this.refs.serverModal)).modal('hide');
      return;
    }

    const forceCleanPrevData = Object.keys(this.state).reduce((p, k) => {
      p[k] = null;
      return p;
    }, {});

    const server = nextProps.server || {};
    const nextState = {
      selectedSSH: false,
      ...forceCleanPrevData,
      ...server || {},
      ssh: {
        ...server.ssh || {},
      },
    };
    this.setState(nextState);

    $(ReactDOM.findDOMNode(this.refs.serverModal)).modal('show');
    $(ReactDOM.findDOMNode(this.refs.clientList)).dropdown('set selected', nextState.client);
  }

  componentDidMount() {
    $(ReactDOM.findDOMNode(this.refs.serverModal)).modal({
      closable: false,
      detachable: false,
      onDeny: () => {
        // TODO: validation
        this.props.onCancelClick();
        return true;
      },
      onApprove: () => {
        // TODO: validation
        const { server } = this.props;
        this.props.onSaveClick(this.state);
        return false;
      }
    });

    $(ReactDOM.findDOMNode(this.refs.clientList)).dropdown();

    $(ReactDOM.findDOMNode(this.refs.sshTunnel)).checkbox({
      onChecked: () => this.setState({ selectedSSH: true }),
      onUnchecked: () => this.setState({ selectedSSH: false })
    });
  }

  render() {
    return (
      <div className="ui modal" ref="serverModal">
        <div className="header">
          Server Information
        </div>
        <div className="content">
          <form className="ui form">
            <div className="fields">
              <div className="ten wide field">
                <label>Name</label>
                <input type="text" name="name" placeholder="Name" value={this.state.name} onChange={::this.handleChange} />
              </div>
              <div className="six wide field">
                <label>Client</label>
                <div className="ui fluid search selection dropdown" ref="clientList">
                  <input type="hidden" name="client" />
                  <i className="dropdown icon"></i>
                  <div className="default text">Select Client</div>
                  <div className="menu">
                    <div className="item" data-value="mysql"><img src="https://www.mysql.com/common/logos/logo-mysql-170x115.png" style={{width: '16px'}} /> MySQL</div>
                    <div className="item" data-value="postgresql"><img src="https://wiki.postgresql.org/images/3/30/PostgreSQL_logo.3colors.120x120.png" style={{width: '16px'}} /> PostgreSQL</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="field">
              <label>Server Address</label>
              <div className="fields">
                <div className="seven wide field">
                  <input type="text" name="host" placeholder="Host" value={this.state.host} onChange={::this.handleChange} />
                </div>
                <div className="three wide field">
                  <input type="text" name="port" placeholder="Port" value={this.state.port} onChange={::this.handleChange} />
                </div>
                <div className="six wide field">
                  <input type="text" name="socketPath" placeholder="Unix socket path" value={this.state.socketPath} onChange={::this.handleChange} />
                </div>
              </div>
            </div>
            <div className="fields">
              <div className="five wide field">
                <label>User</label>
                <input type="text" name="user" maxLength="3" placeholder="User" value={this.state.user} onChange={::this.handleChange} />
              </div>
              <div className="five wide field">
                <label>Password</label>
                <input type="password" name="password" maxLength="3" placeholder="Password" value={this.state.password} onChange={::this.handleChange} />
              </div>
              <div className="six wide field">
                <label>Database</label>
                <input type="text" name="database" maxLength="16" placeholder="Database" value={this.state.database} onChange={::this.handleChange} />
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
                    <input type="text" name="ssh[host]" placeholder="Host" disabled={!this.state.selectedSSH} value={this.state.ssh && this.state.ssh.host} onChange={::this.handleChange} />
                  </div>
                  <div className="three wide field">
                    <input type="text" name="ssh[port]" placeholder="Port" disabled={!this.state.selectedSSH} value={this.state.ssh && this.state.ssh.port} onChange={::this.handleChange} />
                  </div>
                </div>
              </div>
              <div className="fields">
                <div className="five wide field">
                  <label>User</label>
                  <input type="text" name="ssh[user]" maxLength="3" placeholder="User" disabled={!this.state.selectedSSH} value={this.state.ssh && this.state.ssh.user} onChange={::this.handleChange} />
                </div>
                <div className="five wide field">
                  <label>Password</label>
                  <input type="password" name="ssh[password]" maxLength="3" placeholder="Password" disabled={!this.state.selectedSSH} value={this.state.ssh && this.state.ssh.password} onChange={::this.handleChange} />
                </div>
                <div className="six wide field">
                  <label>Private Key</label>
                  <input type="text" name="ssh[privateKey]" maxLength="16" placeholder="~/.ssh/id_rsa" disabled={!this.state.selectedSSH} value={this.state.ssh && this.state.ssh.privateKey} onChange={::this.handleChange} />
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
