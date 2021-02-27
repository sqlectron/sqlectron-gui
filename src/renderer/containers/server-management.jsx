import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import * as ServersActions from '../actions/servers';
import * as ConnActions from '../actions/connections';
import * as ConfigActions from '../actions/config';
import Header from '../components/header';
import Footer from '../components/footer';
import ServerList from '../components/server-list';
import ServerModalForm from '../components/server-modal-form';
import SettingsModalForm from '../components/settings-modal-form';
import ServerFilter from '../components/server-filter';
import Message from '../components/message';

const STYLES = {
  wrapper: { paddingTop: '50px' },
  container: { padding: '10px 10px 50px 10px' },
};

const BREADCRUMB = [{ icon: 'server', label: 'servers' }];

function filterServers(name, servers) {
  const regex = RegExp(name, 'i');
  return servers.filter((srv) => regex.test(srv.name));
}

const ServerManagement = ({ router }) => {
  const [filter, setFilter] = useState('');
  const dispatch = useDispatch();

  const { connections, servers, config, status } = useSelector((state) => ({
    connections: state.connections,
    servers: state.servers,
    config: state.config,
    status: state.status,
  }));

  const onFilterChange = useCallback(
    (event) => {
      setFilter(event.target.value);
    },
    [setFilter]
  );

  const onConnectClick = useCallback(
    ({ id }) => {
      dispatch(ConnActions.setConnecting());
      router.push(`/server/${id}`);
    },
    [dispatch, router]
  );

  const onTestConnectionClick = useCallback(
    (server) => {
      dispatch(ConnActions.test(server));
    },
    [dispatch]
  );

  const onAddClick = useCallback(() => dispatch(ServersActions.startEditing()), [dispatch]);

  const onSettingsClick = useCallback(() => dispatch(ConfigActions.startEditing()), [dispatch]);

  const onEditClick = useCallback((server) => dispatch(ServersActions.startEditing(server.id)), [
    dispatch,
  ]);

  const onDuplicateClick = useCallback(
    (server) => dispatch(ServersActions.duplicateServer({ server })),
    [dispatch]
  );

  const onSaveClick = useCallback(
    (server) => {
      const id = servers.editingServer && servers.editingServer.id;
      dispatch(ServersActions.saveServer({ id, server }));
    },
    [dispatch, servers]
  );

  const onCancelClick = useCallback(() => dispatch(ServersActions.finishEditing()), [dispatch]);

  const onRemoveClick = useCallback(() => {
    const id = servers.editingServer && servers.editingServer.id;
    dispatch(ServersActions.removeServer({ id }));
  }, [dispatch, servers]);

  const onSettingsSaveClick = useCallback((config) => dispatch(ConfigActions.saveConfig(config)), [
    dispatch,
  ]);

  const onSettingsCancelClick = useCallback(() => dispatch(ConfigActions.finishEditing()), [
    dispatch,
  ]);

  const selected = servers.editingServer || {};
  const filteredServers = filterServers(filter, servers.items);

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
          onFilterChange={onFilterChange}
          onAddClick={onAddClick}
          onSettingsClick={onSettingsClick}
        />

        {connections.error && (
          <Message
            closeable
            title="Connection Error"
            message={connections.error.message}
            type="error"
          />
        )}

        <ServerList
          servers={filteredServers}
          onEditClick={onEditClick}
          onConnectClick={onConnectClick}
          config={config}
        />

        {servers.isEditing && (
          <ServerModalForm
            server={selected}
            error={servers.error}
            testConnection={testConnection}
            onTestConnectionClick={onTestConnectionClick}
            onDuplicateClick={onDuplicateClick}
            onSaveClick={onSaveClick}
            onCancelClick={onCancelClick}
            onRemoveClick={onRemoveClick}
          />
        )}

        {config.isEditing && (
          <SettingsModalForm
            config={config}
            error={config.error}
            onSaveClick={onSettingsSaveClick}
            onCancelClick={onSettingsCancelClick}
          />
        )}
      </div>
      <div style={STYLES.footer}>
        <Footer status={status} />
      </div>
    </div>
  );
};

ServerManagement.displayName = 'ServerManagement';

ServerManagement.propTypes = {
  router: PropTypes.object.isRequired,
};

export default withRouter(ServerManagement);
