import { webFrame } from 'electron'; // eslint-disable-line import/no-unresolved
import React, { Component, PropTypes } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import * as ConfigActions from '../actions/config.js';
import imageSrc from './sqlectron.gif';


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
    const { zoomFactor, enabledDarkTheme, disabledOpenAnimation } = config.data;
    if (typeof zoomFactor !== 'undefined' && zoomFactor > 0) {
      // Apply the zoom factor
      // Required for HiDPI support
      webFrame.setZoomFactor(zoomFactor);
    }
    if (enabledDarkTheme === true) {
      $('body').addClass('dark-theme');
    } else {
      $('body').removeClass('dark-theme');
    }

    // remove the loading screen quickly if disabled
    const l1 = document.getElementById('loading');
    const l2 = document.getElementById('loading-signal');
    if (l1 && l2 && disabledOpenAnimation) {
      l1.remove();
      l2.remove();
    }
    if (l1 && l2 && !disabledOpenAnimation) {
      this.runLoadingAnimation();
    }
  }

  componentWillUnmount() {
    document.removeEventListener('dragover', preventDefault, false);
    document.removeEventListener('drop', preventDefault, false);
  }

  // this runs the animated loading
  runLoadingAnimation() {
    const img = new Image();

    img.onload = () => {
      setTimeout(() => {
        const loadingWrapper = document.getElementById('loading');
        const loadingInner = document.createElement('div');

        const version = document.createElement('H3');
        version.appendChild(document.createTextNode(`v${global.SQLECTRON_CONFIG.version}`));

        loadingInner.appendChild(version);
        loadingInner.appendChild(img);

        loadingWrapper.appendChild(loadingInner);

        loadingInner.style.display = 'block';

        setTimeout(() => {
          loadingWrapper.className = 'loading-hidden';

          setTimeout(() => {
            loadingWrapper.remove();
          }, 500);
        }, 4500);

        document.getElementById('loading-signal').remove();
      }, 500);
    };

    img.src = imageSrc;
  }

  render() {
    const { children, config } = this.props;
    let style = null;

    if (config.isLoaded) {
      const customFont = config.data.customFont;
      style = { fontFamily: `'${customFont}', 'Helvetica Neue', Arial, Helvetica, sans-serif` };
    }

    return (
      <div className="ui" style={style}>
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
