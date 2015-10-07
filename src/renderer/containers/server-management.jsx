import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as ConnectionActions from '../actions/servers.js';
import ServerList from '../components/server-list.jsx';
import ServerAdd from '../components/server-add.jsx';


export default class ServerListContainer extends Component {
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

  render() {
    const { servers, dispatch } = this.props;
    const actions = bindActionCreators(ConnectionActions, dispatch);

    return (
      <div>
        List of Connections
        <ServerList servers={servers.servers} actions={actions} />
        <ServerAdd visible={servers.creatingOrEditing} actions={actions} />
      </div>
    );
  }
};


function mapStateToProps(state) {
  return {
    servers: state.servers
  };
}

export default connect(mapStateToProps)(ServerListContainer);
