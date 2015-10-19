import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import * as ServersActions from '../actions/servers.js';
import ServerList from '../components/server-list.jsx';
import ServerModalForm from '../components/server-modal-form.jsx';
import ServerFilter from '../components/server-filter.jsx';


export default class ServerManagerment extends Component {
  static propTypes = {
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

  onConnectClick(server) {
    this.props.history.pushState(null, `/${server.name}`);
  }

  onAddClick() {
    this.setState({ modalVisible: true, selectedId: null });
  }

  onEditClick(index) {
    this.setState({ modalVisible: true, selectedId: index });
  }

  onSaveClick(server) {
    const { selectedId } = this.state;
    const { dispatch } = this.props;
    dispatch(ServersActions.saveServer({ id: selectedId, server }))
      .then(this.setState({ modalVisible: false, selectedId: null }));
  }

  onCancelClick() {
    this.setState({ modalVisible: false, selectedId: null });
  }

  onRemoveClick() {
    const { selectedId } = this.state;
    const { dispatch } = this.props;
    dispatch(ServersActions.removeServer({ id: selectedId }))
      .then(this.setState({ modalVisible: false }));
  }

  onFilterChange(event) {
    this.props.dispatch(ServersActions.filterServers(event.target.value));
  }

  render() {
    const { modalVisible, selectedId } = this.state;
    const { servers } = this.props;
    const selected = selectedId !== null ? servers.items[selectedId] : {};

    return (
      <div className="ui" style={{padding: '1em'}}>
        <h1 className="ui header">Servers</h1>
        <div className="ui divider"></div>

        <ServerFilter
          onFilterChange={::this.onFilterChange}
          onAddClick={::this.onAddClick} />

        <ServerList servers={servers.items}
                    onEditClick={::this.onEditClick}
                    onConnectClick={::this.onConnectClick} />

        {modalVisible && <ServerModalForm
               server={selected}
               error={servers.error}
               onSaveClick={::this.onSaveClick}
               onCancelClick={::this.onCancelClick}
               onRemoveClick={::this.onRemoveClick} />}
      </div>
    );
  }
}


function mapStateToProps(state) {
  return {
    servers: state.servers,
  };
}

export default connect(mapStateToProps)(ServerManagerment);
