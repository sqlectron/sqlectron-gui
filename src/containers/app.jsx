import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as QueryActions from '../actions/query.js';
import Menu from '../menu.jsx';

require('semantic-ui-css/semantic.css');
require('semantic-ui-css/semantic');

class AppContainer extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
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
  }

  static contextTypes = {
    history: PropTypes.object.isRequired
  }

  componentDidMount() {
    const { dispatch } = this.props;
    this.menu = new Menu({
      queryActions: bindActionCreators(QueryActions, dispatch)
    });
  }

  componentDidUpdate() {
    const { queryResult } = this.props;
    this.menu.build({ store: { queryResult } });
  }

  render() {
    const { children } = this.props;

    return (
      <div className="ui">
        {children}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    queryResult: state.queryResult
  };
}

export default connect(mapStateToProps)(AppContainer);
