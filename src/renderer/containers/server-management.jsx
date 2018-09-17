import React, { Component, PropTypes } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import * as ServersActions from '../actions/servers.js';
import * as ConnActions from '../actions/connections.js';
import * as ConfigActions from '../actions/config.js';
import Header from '../components/header.jsx';
import Footer from '../components/footer.jsx';
import ServerList from '../components/server-list.jsx';
import ServerModalForm from '../components/server-modal-form.jsx';
import SettingsModalForm from '../components/settings-modal-form.jsx';
import ServerFilter from '../components/server-filter.jsx';
import Message from '../components/message.jsx';


const STYLES = {
  wrapper: { paddingTop: '50px' },
  container: { padding: '10px 10px 50px 10px' },
};


const BREADCRUMB = [{ icon: 'server', label: 'servers' }];


class ServerManagerment extends Component {
  static propTypes = {
    status: PropTypes.string.isRequired,
    connections: PropTypes.object.isRequired,
    servers: PropTypes.object.isRequired,
    config: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    router: PropTypes.object.isRequired,
    children: PropTypes.node,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {};
  }

  onConnectClick({ id }) {
    this.props.router.push(`/server/${id}`);
  }

  onTestConnectionClick(server) {
    const { dispatch } = this.props;
    dispatch(ConnActions.test(server));
  }

  onAddClick() {
    const { dispatch } = this.props;
    dispatch(ServersActions.startEditing());
  }

  onSettingsClick() {
    const { dispatch } = this.props;
    dispatch(ConfigActions.startEditing());
  }

  onEditClick(server) {
    const { dispatch } = this.props;
    dispatch(ServersActions.startEditing(server.id));
  }

  onDuplicateClick(server) {
    const { dispatch } = this.props;
    dispatch(ServersActions.duplicateServer({ server }));
  }

  onSaveClick(server) {
    const { dispatch, servers } = this.props;
    const id = servers.editingServer && servers.editingServer.id;
    dispatch(ServersActions.saveServer({ id, server }));
  }

  onCancelClick() {
    const { dispatch } = this.props;
    dispatch(ServersActions.finishEditing());
  }

  onRemoveClick() {
    const { dispatch, servers } = this.props;
    const id = servers.editingServer && servers.editingServer.id;
    dispatch(ServersActions.removeServer({ id }));
  }

  onSettingsSaveClick(config) {
    const { dispatch } = this.props;
    dispatch(ConfigActions.saveConfig(config));
  }

  onSettingsCancelClick() {
    const { dispatch } = this.props;
    dispatch(ConfigActions.finishEditing());
  }

  onFilterChange(event) {
    this.setState({ filter: event.target.value });
  }

  filterServers(name, servers) {
    const regex = RegExp(name, 'i');
    return servers.filter(srv => regex.test(srv.name));
  }

  render() {
    const { filter } = this.state;
    const { connections, servers, config, status } = this.props;
    const selected = servers.editingServer || {};
    const filteredServers = this.filterServers(filter, servers.items);

    const testConnection = {
      connected: connections.testConnected,
      connecting: connections.testConnecting,
      error: connections.testError,
    };

    return (
      <div style={STYLES.wrapper}>
        <div style={STYLES.header}>
          <Header items={BREADCRUMB} />
        </div>
        <div style={STYLES.container}>
          <ServerFilter
            onFilterChange={::this.onFilterChange}
            onAddClick={::this.onAddClick}
            onSettingsClick={::this.onSettingsClick} />

          {
            connections.error &&
              <Message
                closeable
                title="Connection Error"
                message={connections.error.message}
                type="error" />
          }

          <ServerList servers={filteredServers}
            onEditClick={::this.onEditClick}
            onConnectClick={::this.onConnectClick}
            config={config} />

          {servers.isEditing && <ServerModalForm
            server={selected}
            error={servers.error}
            testConnection={testConnection}
            onTestConnectionClick={::this.onTestConnectionClick}
            onDuplicateClick={::this.onDuplicateClick}
            onSaveClick={::this.onSaveClick}
            onCancelClick={::this.onCancelClick}
            onRemoveClick={::this.onRemoveClick} />}

          {config.isEditing && <SettingsModalForm
            config={config}
            error={config.error}
            onSaveClick={::this.onSettingsSaveClick}
            onCancelClick={::this.onSettingsCancelClick} />}
        </div>
        <div style={STYLES.footer}>
          <Footer status={status} />
        </div>
      </div>
    );
  }
}


function mapStateToProps(state) {
  return {
    connections: state.connections,
    servers: state.servers,
    config: state.config,
    status: state.status,
  };
}

export default connect(mapStateToProps)(withRouter(ServerManagerment));
