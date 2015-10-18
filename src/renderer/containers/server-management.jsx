import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import * as ServersActions from '../actions/servers.js';
import ServerList from '../components/server-list.jsx';
import ServerModalForm from '../components/server-modal-form.jsx';


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

  componentWillReceiveProps(nextProps) {
    if (this.state.saving && !nextProps.servers.error) {
      this.setState({ saving: false, modalVisible: false });
    }
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
    this.setState({ saving: true });
    dispatch(ServersActions.saveServer({ id: selectedId, server }));
  }

  onCancelClick() {
    this.setState({ modalVisible: false, selectedId: null });
  }

  render() {
    const { modalVisible, selectedId } = this.state;
    const { servers } = this.props;
    const selected = selectedId !== null ? servers.items[selectedId] : {};

    return (
      <div className="ui" style={{padding: '1em'}}>
        <h1 className="ui header">Servers</h1>
        <div className="ui divider"></div>

        <button className="ui button" style={{marginBottom: '1em'}} onClick={::this.onAddClick}>Add</button>

        <ServerList servers={servers.items}
                    onEditClick={::this.onEditClick}
                    onConnectClick={::this.onConnectClick} />

        {modalVisible && <ServerModalForm
               server={selected}
               error={servers.error}
               onSaveClick={::this.onSaveClick}
               onCancelClick={::this.onCancelClick} />}
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
