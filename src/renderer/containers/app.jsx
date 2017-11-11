import { webFrame } from 'electron'; // eslint-disable-line import/no-unresolved
import React, { Component, PropTypes } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import * as ConfigActions from '../actions/config.js';


import '../../../vendor/renderer/semantic-ui/semantic';
require('../../../vendor/renderer/lato/latofonts.css');
require('../../../vendor/renderer/semantic-ui/semantic.css');
require('./app.css');

const preventDefault = e => e.preventDefault();

class AppContainer extends Component {
  static propTypes = {
    config: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    router: PropTypes.object.isRequired,
    children: PropTypes.node,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {};
  }

  componentWillMount() {
    this.props.dispatch(ConfigActions.loadConfig());
  }

  componentDidMount() {
    // Prevent drag and drop causing redirect
    document.addEventListener('dragover', preventDefault, false);
    document.addEventListener('drop', preventDefault, false);
  }

  componentWillReceiveProps(newProps) {
    const { config } = newProps;
    if (!config.data) { return; }

    const { zoomFactor } = config.data;
    if (typeof zoomFactor !== 'undefined' && zoomFactor > 0) {
      // Apply the zoom factor
      // Required for HiDPI support
      webFrame.setZoomFactor(zoomFactor);
    }
  }

  componentWillUnmount() {
    document.removeEventListener('dragover', preventDefault, false);
    document.removeEventListener('drop', preventDefault, false);
  }

  render() {
    const { children, config } = this.props;
    return (
      <div className="ui">
        {config.isLoaded ? children : null}
      </div>
    );
  }
}


function mapStateToProps(state) {
  return {
    config: state.config,
  };
}

export default connect(mapStateToProps)(withRouter(AppContainer));
