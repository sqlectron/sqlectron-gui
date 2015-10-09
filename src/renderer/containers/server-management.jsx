import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
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
      pathname: PropTypes.string.isRequired
    }),
    params: PropTypes.shape({
      userLogin: PropTypes.string,
      repoName: PropTypes.string
    }).isRequired,
    children: PropTypes.node
  };

  static contextTypes = {
    history: PropTypes.object.isRequired
  }

  constructor(props, context) {
    super(props, context);
    this.state = {};
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
      .then(() => this.onCancelClick());
  }

  onCancelClick() {
    this.setState({ modalVisible: false, selectedId: null });
  }

  componentDidMount() {
    this.props.dispatch(ServersActions.loadServers());
  }

  render() {
    const { modalVisible, selectedId } = this.state;
    const { servers, dispatch } = this.props;
    const actions = bindActionCreators(ServersActions, dispatch);
    const selected = selectedId ? servers.items[selectedId] : {};
    
    return (
      <div className="ui" style={{padding: '1em'}}>
        <h1 className="ui header">Servers</h1>
        <div className="ui divider"></div>

        <button className="ui button" style={{marginBottom: '1em'}} onClick={::this.onAddClick}>Add</button>

        <ServerList servers={servers.items}
                    onEditClick={::this.onEditClick}
                    onConnectClick={::this.onConnectClick} />

        <ServerModalForm visible={!!modalVisible}
                         server={selected}
                         onSaveClick={::this.onSaveClick}
                         onCancelClick={::this.onCancelClick} />
      </div>
    );
  }
};


function mapStateToProps(state) {
  return {
    servers: state.servers
  };
}

export default connect(mapStateToProps)(ServerManagerment);
