import React, { Component, PropTypes } from 'react';
import Select from 'react-select';
import { sqlectron } from '../../browser/remote';
import ConfirmModal from './confim-modal.jsx';
import Message from './message.jsx';


require('react-select/dist/react-select.css');
require('./override-select.css');


const CLIENTS = sqlectron.db.CLIENTS.map(dbClient => ({
  value: dbClient.key,
  logo: require(`./server-db-client-${dbClient.key}.png`), // eslint-disable-line global-require
  label: dbClient.name,
  defaultPort: dbClient.defaultPort,
}));


export default class ServerModalForm extends Component {
  static propTypes = {
    onSaveClick: PropTypes.func.isRequired,
    onCancelClick: PropTypes.func.isRequired,
    onRemoveClick: PropTypes.func.isRequired,
    onTestConnectionClick: PropTypes.func.isRequired,
    onDuplicateClick: PropTypes.func.isRequired,
    server: PropTypes.object,
    error: PropTypes.object,
    testConnection: PropTypes.object,
  }

  constructor(props, context) {
    super(props, context);
    const server = props.server || {};
    this.state = {
      ...server,
      isNew: !server.id,
    };
  }

  componentDidMount() {
    $(this.refs.serverModal).modal({
      closable: false,
      detachable: false,
      allowMultiple: true,
      observeChanges: true,
      onDeny: () => {
        this.props.onCancelClick();
        return true;
      },
      onApprove: () => false,
    }).modal('show');

    $(this.refs.sshTunnel).checkbox({
      onChecked: () => this.setState({ ssh: {} }),
      onUnchecked: () => this.setState({ ssh: null }),
    });

    $(this.refs.ssl).checkbox({
      onChecked: () => this.setState({ ssl: true }),
      onUnchecked: () => this.setState({ ssl: false }),
    });

    $(this.refs.privateKeyWithPassphrase).checkbox({
      onChecked: () => {
        const ssh = this.state.ssh ? { ...this.state.ssh } : {};
        ssh.privateKeyWithPassphrase = true;
        this.setState({ ssh });
      },
      onUnchecked: () => {
        const ssh = this.state.ssh ? { ...this.state.ssh } : {};
        ssh.privateKeyWithPassphrase = false;
        this.setState({ ssh });
      },
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ error: nextProps.error });
  }

  componentWillUnmount() {
    $(this.refs.serverModal).modal('hide');
  }

  onSaveClick() {
    this.props.onSaveClick(this.mapStateToServer(this.state));
  }

  onRemoveCancelClick() {
    this.setState({ confirmingRemove: false });
  }

  onRemoveConfirmClick() {
    this.props.onRemoveClick();
  }

  onRemoveOpenClick() {
    this.setState({ confirmingRemove: true });
  }

  onTestConnectionClick() {
    this.props.onTestConnectionClick(this.mapStateToServer(this.state));
  }

  onDuplicateClick() {
    this.props.onDuplicateClick(this.mapStateToServer(this.state));
  }

  mapStateToServer(state) {
    const server = {
      name: state.name,
      client: state.client,
      ssl: !!state.ssl,
      host: state.host && state.host.length ? state.host : null,
      port: state.port || state.defaultPort,
      socketPath: state.socketPath && state.socketPath.length ? state.socketPath : null,
      user: state.user,
      password: state.password,
      database: state.database,
    };
    if (!this.state.ssh) { return server; }

    const { ssh } = state;
    server.ssh = {
      host: ssh.host,
      port: ssh.port,
      user: ssh.user,
      password: ssh.password && ssh.password.length ? ssh.password : null,
      privateKey: ssh.privateKey && ssh.privateKey.length ? ssh.privateKey : null,
      privateKeyWithPassphrase: !!ssh.privateKeyWithPassphrase,
    };

    return server;
  }

  highlightError(name) {
    const { error } = this.state;
    let hasError = !!(error && error[name]);
    if (error && error.ssh && /^ssh\./.test(name)) {
      const sshErrors = error.ssh[0].errors[0];
      const lastName = name.replace(/^ssh\./, '');
      hasError = !!~Object.keys(sshErrors).indexOf(lastName);
    }
    return hasError ? 'error' : '';
  }

  handleOnClientChange(client) {
    this.setState({ client });

    const clientConfig = CLIENTS.find(entry => entry.value === client);
    if (clientConfig && clientConfig.defaultPort) {
      this.setState({ defaultPort: clientConfig.defaultPort });
    }
  }

  handleChange(event) {
    const newState = {};
    const { target } = event;
    const value = target.files ? target.files[0].path : target.value;
    const [name1, name2] = target.name.replace(/^file\./, '').split('.');

    if (name1 === 'ssh') {
      newState.ssh = { ...this.state.ssh, [name2]: value };
    } else {
      newState[name1] = value;
    }

    return this.setState(newState);
  }

  renderClientItem({ label, logo }) {
    return (
      <div>
        <img alt="logo" src={logo} style={{ width: '16px' }} /> {label}
      </div>
    );
  }

  render() {
    const { testConnection } = this.props;
    const { confirmingRemove, isNew } = this.state;
    const isSSHChecked = !!this.state.ssh;
    const ssh = this.state.ssh || {};

    const classStatusButtons = testConnection.connecting ? 'disabled' : '';
    const classStatusTestButton = testConnection.connecting ? 'loading' : '';

    return (
      <div id="server-modal" className="ui modal" ref="serverModal">
        <div className="header">
          Server Information
        </div>
        <div className="content">
          {
            testConnection.error && <Message
              closeable
              title="Connection Error"
              message={testConnection.error.message}
              type="error" />
          }
          {
            testConnection.connected && <Message
              closeable
              title="Connection Test"
              message="Successfully connected"
              type="success" />
          }
          <form className="ui form">
            <div className="fields">
              <div className={`nine wide field ${this.highlightError('name')}`}>
                <label>Name</label>
                <input type="text"
                  name="name"
                  maxLength="250"
                  placeholder="Name"
                  value={this.state.name}
                  onChange={::this.handleChange} />
              </div>
              <div className={`six wide field ${this.highlightError('client')}`}>
                <label>Client</label>
                <Select
                  name="client"
                  placeholder="Select"
                  options={CLIENTS}
                  onChange={::this.handleOnClientChange}
                  optionRenderer={this.renderClientItem}
                  valueRenderer={this.renderClientItem}
                  value={this.state.client} />
              </div>
              <div className="one field" style={{ paddingTop: '2em' }}>
                <div className="ui toggle checkbox" ref="ssl">
                  <input type="checkbox"
                    name="ssl"
                    tabIndex="0"
                    className="hidden"
                    defaultChecked={this.state.ssl} />
                  <label>SSL</label>
                </div>
              </div>
            </div>
            <div className="field">
              <label>Server Address</label>
              <div className="fields">
                <div className={`seven wide field ${this.highlightError('host')}`}>
                  <input type="text"
                    name="host"
                    maxLength="250"
                    placeholder="Host"
                    value={this.state.host}
                    onChange={::this.handleChange}
                    disabled={this.state.socketPath} />
                </div>
                <div className={`three wide field ${this.highlightError('port')}`}>
                  <input type="number"
                    name="port"
                    maxLength="5"
                    placeholder="Port"
                    value={this.state.port || this.state.defaultPort}
                    onChange={::this.handleChange}
                    disabled={this.state.socketPath} />
                </div>
                <div className={`six wide field ${this.highlightError('socketPath')}`}>
                  <div className="ui action input">
                    <input type="text"
                      name="socketPath"
                      maxLength="250"
                      placeholder="Unix socket path"
                      value={this.state.socketPath}
                      onChange={::this.handleChange}
                      disabled={(this.state.host || this.state.port)} />
                    <label htmlFor="file.socketPath" className="ui icon button btn-file">
                      <i className="file outline icon" />
                      <input
                        type="file"
                        id="file.socketPath"
                        name="file.socketPath"
                        onChange={::this.handleChange}
                        style={{ display: 'none' }} />
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="fields">
              <div className={`five wide field ${this.highlightError('user')}`}>
                <label>User</label>
                <input type="text"
                  name="user"
                  maxLength="55"
                  placeholder="User"
                  value={this.state.user}
                  onChange={::this.handleChange} />
              </div>
              <div className={`five wide field ${this.highlightError('password')}`}>
                <label>Password</label>
                <input type="password"
                  name="password"
                  maxLength="55"
                  placeholder="Password"
                  value={this.state.password}
                  onChange={::this.handleChange} />
              </div>
              <div className={`six wide field ${this.highlightError('database')}`}>
                <label>Database</label>
                <input type="text"
                  name="database"
                  maxLength="100"
                  placeholder="Database"
                  value={this.state.database}
                  onChange={::this.handleChange} />
              </div>
            </div>
            <div className="ui segment">
              <div className="one field">
                <div className="ui toggle checkbox" ref="sshTunnel">
                  <input type="checkbox"
                    name="sshTunnel"
                    tabIndex="0"
                    className="hidden"
                    defaultChecked={isSSHChecked} />
                  <label>SSH Tunnel</label>
                </div>
              </div>
              <div className="field">
                <label>SSH Address</label>
                <div className="fields">
                  <div className={`seven wide field ${this.highlightError('ssh.host')}`}>
                    <input type="text"
                      name="ssh.host"
                      maxLength="250"
                      placeholder="Host"
                      disabled={!isSSHChecked}
                      value={ssh.host}
                      onChange={::this.handleChange} />
                  </div>
                  <div className={`three wide field ${this.highlightError('ssh.port')}`}>
                    <input type="number"
                      name="ssh.port"
                      maxLength="5"
                      placeholder="Port"
                      disabled={!isSSHChecked}
                      value={ssh.port}
                      onChange={::this.handleChange} />
                  </div>
                </div>
              </div>
              <div className="fields">
                <div className={`four wide field ${this.highlightError('ssh.user')}`}>
                  <label>User</label>
                  <input type="text"
                    name="ssh.user"
                    maxLength="55"
                    placeholder="User"
                    disabled={!isSSHChecked}
                    value={ssh.user}
                    onChange={::this.handleChange} />
                </div>
                <div className={`four wide field ${this.highlightError('ssh.password')}`}>
                  <label>Password</label>
                  <input type="password"
                    name="ssh.password"
                    maxLength="55"
                    placeholder="Password"
                    disabled={(!isSSHChecked || ssh.privateKey)}
                    value={ssh.password}
                    onChange={::this.handleChange} />
                </div>
                <div className={`five wide field ${this.highlightError('ssh.privateKey')}`}>
                  <label>Private Key</label>
                  <div className="ui action input">
                    <input type="text"
                      name="ssh.privateKey"
                      maxLength="250"
                      placeholder="~/.ssh/id_rsa"
                      disabled={(!isSSHChecked || ssh.password)}
                      value={ssh.privateKey}
                      onChange={::this.handleChange} />
                    <label htmlFor="file.ssh.privateKey" className="ui icon button btn-file">
                      <i className="file outline icon" />
                      <input
                        type="file"
                        id="file.ssh.privateKey"
                        name="file.ssh.privateKey"
                        onChange={::this.handleChange}
                        style={{ display: 'none' }} />
                    </label>
                  </div>
                </div>
                <div className="three wide field" style={{ paddingTop: '2em' }}>
                  <div className="ui toggle checkbox" ref="privateKeyWithPassphrase">
                    <input type="checkbox"
                      name="privateKeyWithPassphrase"
                      tabIndex="0"
                      className="hidden"
                      disabled={(!isSSHChecked || ssh.password)}
                      defaultChecked={this.state.ssh && this.state.ssh.privateKeyWithPassphrase} />
                    <label>Passphrase</label>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
        <div className="actions">
          <div className={`small ui blue right labeled icon button ${classStatusTestButton}`}
            tabIndex="0"
            onClick={::this.onTestConnectionClick}>
            Test
            <i className="plug icon"></i>
          </div>
          {!isNew && <div className={`small ui right labeled icon button ${classStatusButtons}`}
            tabIndex="0"
            onClick={::this.onDuplicateClick}>
            Duplicate
            <i className="copy icon"></i>
          </div>}
          <div className={`small ui black deny right labeled icon button ${classStatusButtons}`}
            tabIndex="0">
            Cancel
            <i className="ban icon"></i>
          </div>
          <div className={`small ui green right labeled icon button ${classStatusButtons}`}
            tabIndex="0"
            onClick={::this.onSaveClick}>
            Save
            <i className="checkmark icon"></i>
          </div>
          {!isNew && <div className={`small ui red right labeled icon button ${classStatusButtons}`}
            tabIndex="0"
            onClick={::this.onRemoveOpenClick}>
            Remove
            <i className="trash icon"></i>
          </div>}
        </div>
        {confirmingRemove && <ConfirmModal
          context="#server-modal"
          title={`Delete ${this.state.name}`}
          message="Are you sure you want to remove this server connection?"
          onCancelClick={::this.onRemoveCancelClick}
          onRemoveClick={::this.onRemoveConfirmClick} />}
      </div>
    );
  }
}
