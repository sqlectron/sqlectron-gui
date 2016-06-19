import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import * as ServersActions from '../actions/servers.js';
import * as ConnActions from '../actions/connections.js';
import Header from '../components/header.jsx';
import Footer from '../components/footer.jsx';
import ServerList from '../components/server-list.jsx';
import ServerModalForm from '../components/server-modal-form.jsx';
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
    dispatch: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    route: PropTypes.object.isRequired,
    routeParams: PropTypes.object.isRequired,
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired,
    }),
    children: PropTypes.node,
  };

  static contextTypes = {
    history: PropTypes.object.isRequired,
  }

  constructor(props, context) {
    super(props, context);
    this.state = {};
  }

  componentDidMount() {
    this.props.dispatch(ServersActions.loadServers());
  }

  onConnectClick({ id }) {
    this.props.history.pushState(null, `/server/${id}`);
  }

  onTestConnectionClick(server) {
    const { dispatch } = this.props;
    dispatch(ConnActions.test(server));
  }

  onAddClick() {
    const { dispatch } = this.props;
    dispatch(ServersActions.startEditing());
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
    dispatch(ServersActions.saveServer({ id: servers.editingId, server }));
  }

  onCancelClick() {
    const { dispatch } = this.props;
    dispatch(ServersActions.finisEditing());
  }

  onRemoveClick() {
    const { dispatch, servers } = this.props;
    dispatch(ServersActions.removeServer({ id: servers.editingId }));
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
    const { connections, servers, status } = this.props;
    const selected = (
      servers.editingId !== null
      ? servers.items.find(srv => srv.id === servers.editingId)
      : {}
    );
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
            onAddClick={::this.onAddClick} />

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
            onConnectClick={::this.onConnectClick} />

          {servers.isEditing && <ServerModalForm
            server={selected}
            error={servers.error}
            testConnection={testConnection}
            onTestConnectionClick={::this.onTestConnectionClick}
            onDuplicateClick={::this.onDuplicateClick}
            onSaveClick={::this.onSaveClick}
            onCancelClick={::this.onCancelClick}
            onRemoveClick={::this.onRemoveClick} />}
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
    status: state.status,
  };
}

export default connect(mapStateToProps)(ServerManagerment);
