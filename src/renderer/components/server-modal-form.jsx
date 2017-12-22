import React, { Component, PropTypes } from 'react';
import set from 'lodash.set';
import Select from 'react-select';
import { sqlectron } from '../../browser/remote';
import ConfirmModal from './confim-modal.jsx';
import Message from './message.jsx';
import Checkbox from './checkbox.jsx';
import { requireLogos } from './require-context';


require('react-select/dist/react-select.css');
require('./override-select.css');


const CLIENTS = sqlectron.db.CLIENTS.map(dbClient => ({
  value: dbClient.key,
  logo: requireLogos(`./server-db-client-${dbClient.key}.png`),
  label: dbClient.name,
  defaultPort: dbClient.defaultPort,
  disabledFeatures: dbClient.disabledFeatures,
}));

const DEFAULT_SSH_PORT = 22;

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
      showPlainPassword: false,
    };
  }

  componentDidMount() {
    $(this.refs.serverModal).modal({
      closable: true,
      detachable: false,
      allowMultiple: true,
      observeChanges: true,
      onHidden: () => {
        this.props.onCancelClick();
        return true;
      },
      onDeny: () => {
        this.props.onCancelClick();
        return true;
      },
      onApprove: () => false,
    }).modal('show');
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

  onToggleShowPlainPasswordClick() {
    this.setState({ showPlainPassword: !this.state.showPlainPassword });
  }

  isFeatureDisabled(feature) {
    if (!this.state.client) {
      return false;
    }

    const dbClient = CLIENTS.find(dbc => dbc.value === this.state.client);
    return !!(dbClient.disabledFeatures && ~dbClient.disabledFeatures.indexOf(feature));
  }

  mapStateToServer(state) {
    const server = {
      name: state.name,
      client: state.client,
      ssl: !!state.ssl,
      host: state.host && state.host.length ? state.host : null,
      port: state.port || state.defaultPort,
      socketPath: state.socketPath && state.socketPath.length ? state.socketPath : null,
      user: state.user || null,
      password: state.password || null,
      database: state.database,
      domain: state.domain,
      schema: state.schema || null,
    };

    const { ssh } = state;
    if (ssh) {
      server.ssh = {
        host: ssh.host,
        port: ssh.port || DEFAULT_SSH_PORT,
        user: ssh.user,
        password: ssh.password && ssh.password.length ? ssh.password : null,
        privateKey: ssh.privateKey && ssh.privateKey.length ? ssh.privateKey : null,
        privateKeyWithPassphrase: !!ssh.privateKeyWithPassphrase,
      };
    }

    const { filter } = state;
    if (filter) {
      server.filter = {};
      const addFilter = (type) => {
        if (!filter[type]) return;

        server.filter[type] = {
          only: (filter[type].only || []).filter(val => val),
          ignore: (filter[type].ignore || []).filter(val => val),
        };

        if (!server.filter[type].only.length && !server.filter[type].ignore.length) {
          delete server.filter[type];
        }
      };

      addFilter('database');
      addFilter('schema');

      if (!Object.keys(server.filter).length) {
        delete server.filter;
      }
    }

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
    let value = target.files ? target.files[0].path : target.value;
    const name = target.name.replace(/^file\./, '');
    const [name1, name2] = name.split('.');

    if (name1 && name2) {
      newState[name1] = { ...this.state[name1] };
    }

    if (name1 === 'filter') {
      value = value.split('\n');
    }

    set(newState, name, value);

    return this.setState(newState);
  }

  renderClientItem({ label, logo }) {
    return (
      <div>
        <img alt="logo" src={logo} style={{ width: '16px' }} /> {label}
      </div>
    );
  }

  renderMessage() {
    const { testConnection } = this.props;

    if (testConnection.error) {
      return (
        <Message
          closeable
          title="Connection Error"
          message={testConnection.error.message}
          type="error" />
      );
    }

    if (testConnection.connected) {
      return (
        <Message
          closeable
          title="Connection Test"
          message="Successfully connected"
          type="success" />
      );
    }

    return null;
  }

  renderBasicPanel() {
    return (
      <div>
        <div className="fields">
          <div className={`nine wide field ${this.highlightError('name')}`}>
            <label>Name</label>
            <input type="text"
              name="name"
              placeholder="Name"
              value={this.state.name || ''}
              onChange={::this.handleChange} />
          </div>
          <div className={`six wide field ${this.highlightError('client')}`}>
            <label>Database Type</label>
            <Select
              name="client"
              placeholder="Select"
              options={CLIENTS}
              clearable={false}
              onChange={::this.handleOnClientChange}
              optionRenderer={this.renderClientItem}
              valueRenderer={this.renderClientItem}
              value={this.state.client} />
          </div>
          <div className="one field" style={{ paddingTop: '2em' }}>
            <Checkbox
              name="ssl"
              label="SSL"
              disabled={this.isFeatureDisabled('server:ssl')}
              defaultChecked={this.state.ssl}
              onChecked={() => this.setState({ ssl: true })}
              onUnchecked={() => this.setState({ ssl: false })} />
          </div>
        </div>
        <div className="field">
          <label>Server Address</label>
          <div className="fields">
            <div className={`five wide field ${this.highlightError('host')}`}>
              <input type="text"
                name="host"
                placeholder="Host"
                value={this.state.host || ''}
                onChange={::this.handleChange}
                disabled={this.isFeatureDisabled('server:host') || this.state.socketPath} />
            </div>
            <div className={`two wide field ${this.highlightError('port')}`}>
              <input type="number"
                name="port"
                maxLength="5"
                placeholder="Port"
                value={this.state.port || this.state.defaultPort || ''}
                onChange={::this.handleChange}
                disabled={this.isFeatureDisabled('server:port') || this.state.socketPath} />
            </div>
            <div className={`four wide field ${this.highlightError('domain')}`}>
              <input type="text"
                name="domain"
                placeholder="Domain"
                value={this.state.domain || ''}
                disabled={this.isFeatureDisabled('server:domain')}
                onChange={::this.handleChange} />
            </div>
            <div className={`five wide field ${this.highlightError('socketPath')}`}>
              <div className="ui action input">
                <input type="text"
                  name="socketPath"
                  placeholder="Unix socket path"
                  value={this.state.socketPath || ''}
                  onChange={::this.handleChange}
                  disabled={(
                    this.state.host ||
                    this.state.port ||
                    this.isFeatureDisabled('server:socketPath')
                  )} />
                <label htmlFor="file.socketPath" className="ui icon button btn-file">
                  <i className="file outline icon" />
                  <input
                    type="file"
                    id="file.socketPath"
                    name="file.socketPath"
                    onChange={::this.handleChange}
                    style={{ display: 'none' }}
                    disabled={(
                      this.state.host ||
                      this.state.port ||
                      this.isFeatureDisabled('server:socketPath')
                    )} />
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className="fields">
          <div className={`four wide field ${this.highlightError('user')}`}>
            <label>User</label>
            <input type="text"
              name="user"
              placeholder="User"
              value={this.state.user || ''}
              disabled={this.isFeatureDisabled('server:user')}
              onChange={::this.handleChange} />
          </div>
          <div className={`four wide field ${this.highlightError('password')}`}>
            <div>
              <label>Password</label>
            </div>
            <div className="ui action input">
              <input type={this.state.showPlainPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={this.state.password || ''}
                disabled={this.isFeatureDisabled('server:password')}
                onChange={::this.handleChange} />
              <span className="ui icon button"
                onClick={::this.onToggleShowPlainPasswordClick}>
                <i className="unhide icon"></i>
              </span>
            </div>
          </div>
          <div className={`four wide field ${this.highlightError('database')}`}>
            <label>Initial Database/Keyspace</label>
            <div className={this.state.client === 'sqlite' && 'ui action input'}>
              <input type="text"
                name="database"
                placeholder="Database"
                value={this.state.database || ''}
                onChange={::this.handleChange} />
              {this.state.client === 'sqlite' &&
                <label htmlFor="file.database" className="ui icon button btn-file">
                  <i className="file outline icon" />
                  <input
                    type="file"
                    id="file.database"
                    name="file.database"
                    onChange={::this.handleChange}
                    style={{ display: 'none' }} />
                </label>
              }
            </div>
          </div>
          <div className={`four wide field ${this.highlightError('schema')}`}>
            <label>Initial Schema</label>
            <input type="text"
              name="schema"
              maxLength="100"
              placeholder="Schema"
              disabled={this.isFeatureDisabled('server:schema')}
              value={this.state.schema || ''}
              onChange={::this.handleChange} />
          </div>
        </div>
      </div>
    );
  }

  renderSSHPanel() {
    const isSSHChecked = !!this.state.ssh;
    const ssh = this.state.ssh || {};

    if (this.isFeatureDisabled('server:ssh')) {
      return null;
    }

    return (
      <div className="ui segment">
        <div className="one field">
          <Checkbox
            name="sshTunnel"
            label="SSH Tunnel"
            defaultChecked={isSSHChecked}
            onChecked={() => this.setState({ ssh: {} })}
            onUnchecked={() => this.setState({ ssh: null })} />
        </div>
        {isSSHChecked &&
          <div>
            <div className="field">
              <label>SSH Address</label>
              <div className="fields">
                <div className={`seven wide field ${this.highlightError('ssh.host')}`}>
                  <input type="text"
                    name="ssh.host"
                    placeholder="Host"
                    disabled={!isSSHChecked}
                    value={ssh.host || ''}
                    onChange={::this.handleChange} />
                </div>
                <div className={`three wide field ${this.highlightError('ssh.port')}`}>
                  <input type="number"
                    name="ssh.port"
                    maxLength="5"
                    placeholder="Port"
                    disabled={!isSSHChecked}
                    value={ssh.port || DEFAULT_SSH_PORT}
                    onChange={::this.handleChange} />
                </div>
              </div>
            </div>
            <div className="fields">
              <div className={`four wide field ${this.highlightError('ssh.user')}`}>
                <label>User</label>
                <input type="text"
                  name="ssh.user"
                  placeholder="User"
                  disabled={!isSSHChecked}
                  value={ssh.user || ''}
                  onChange={::this.handleChange} />
              </div>
              <div className={`four wide field ${this.highlightError('ssh.password')}`}>
                <label>Password</label>
                <input type="password"
                  name="ssh.password"
                  placeholder="Password"
                  disabled={(!isSSHChecked || ssh.privateKey)}
                  value={ssh.password || ''}
                  onChange={::this.handleChange} />
              </div>
              <div className={`five wide field ${this.highlightError('ssh.privateKey')}`}>
                <label>Private Key</label>
                <div className="ui action input">
                  <input type="text"
                    name="ssh.privateKey"
                    placeholder="~/.ssh/id_rsa"
                    disabled={(!isSSHChecked || ssh.password)}
                    value={ssh.privateKey || ''}
                    onChange={::this.handleChange} />
                  <label htmlFor="file.ssh.privateKey" className="ui icon button btn-file">
                    <i className="file outline icon" />
                    <input
                      type="file"
                      id="file.ssh.privateKey"
                      name="file.ssh.privateKey"
                      onChange={::this.handleChange}
                      disabled={(!isSSHChecked || ssh.password)}
                      style={{ display: 'none' }} />
                  </label>
                </div>
              </div>
              <div className="three wide field" style={{ paddingTop: '2em' }}>
                <Checkbox
                  name="ssh.privateKeyWithPassphrase"
                  label="Passphrase"
                  disabled={!!(!isSSHChecked || ssh.password)}
                  defaultChecked={ssh && ssh.privateKeyWithPassphrase}
                  onChecked={() => {
                    const stateSSH = this.state.ssh ? { ...this.state.ssh } : {};
                    stateSSH.privateKeyWithPassphrase = true;
                    this.setState({ ssh: stateSSH });
                  }}
                  onUnchecked={() => {
                    const stateSSH = this.state.ssh ? { ...this.state.ssh } : {};
                    stateSSH.privateKeyWithPassphrase = false;
                    this.setState({ ssh: stateSSH });
                  }} />
              </div>
            </div>
          </div>
        }
      </div>
    );
  }

  renderFilterPanelItem(isFilterChecked, filter, label, type) {
    const filterType = filter[type] || {};

    return (
      <div className="field">
        <label>{label}</label>
        <div className="fields">
          <div className={`eight wide field ${this.highlightError(`filter.${type}.only`)}`}>
            <label>Only</label>
            <textarea
              name={`filter.${type}.only`}
              placeholder="Only"
              rows="3"
              disabled={!isFilterChecked}
              value={filterType.only ? filterType.only.join('\n') : ''}
              onChange={::this.handleChange} />
          </div>
          <div className={`eight wide field ${this.highlightError(`filter.${type}.ignore`)}`}>
            <label>Ignore</label>
            <textarea
              name={`filter.${type}.ignore`}
              placeholder="Ignore"
              rows="3"
              disabled={!isFilterChecked}
              value={filterType.ignore ? filterType.ignore.join('\n') : ''}
              onChange={::this.handleChange} />
          </div>
        </div>
      </div>
    );
  }

  renderFilterPanel() {
    /* eslint max-len:0 */
    const isFilterChecked = !!this.state.filter;
    const filter = this.state.filter || {};

    if (this.isFeatureDisabled('server:filter')) {
      return null;
    }

    return (
      <div className="ui segment">
        <div className="one field">
          <Checkbox
            name="filter"
            label="Filter"
            defaultChecked={isFilterChecked}
            onChecked={() => this.setState({ filter: {} })}
            onUnchecked={() => this.setState({ filter: null })} />
        </div>
        {isFilterChecked &&
          <div>
            <p><em>Allow to pre filter the data available in the sidebar. It improves the rendering performance for large servers.<br />Separate values by break line</em></p>
            {this.renderFilterPanelItem(isFilterChecked, filter, 'Database', 'database')}
            {this.renderFilterPanelItem(isFilterChecked, filter, 'Schema', 'schema')}
          </div>
        }
      </div>
    );
  }

  renderActionsPanel() {
    const { testConnection } = this.props;
    const { isNew, client } = this.state;

    const classStatusButtons = testConnection.connecting ? 'disabled' : '';
    const classStatusTestButton = [
      client ? '' : 'disabled',
      testConnection.connecting ? 'loading' : '',
    ].join(' ');

    return (
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
    );
  }

  renderConfirmRemoveModal() {
    const { confirmingRemove } = this.state;

    if (!confirmingRemove) {
      return null;
    }

    return (
      <ConfirmModal
        context="#server-modal"
        title={`Delete ${this.state.name}`}
        message="Are you sure you want to remove this server connection?"
        onCancelClick={::this.onRemoveCancelClick}
        onRemoveClick={::this.onRemoveConfirmClick} />
    );
  }

  render() {
    return (
      <div id="server-modal" className="ui modal" ref="serverModal">
        <div className="header">
          Server Information
        </div>
        <div className="content">
          {this.renderMessage()}
          <form className="ui form">
            {this.renderBasicPanel()}
            {this.renderSSHPanel()}
            {this.renderFilterPanel()}
          </form>
        </div>
        {this.renderActionsPanel()}
        {this.renderConfirmRemoveModal()}
      </div>
    );
  }
}
