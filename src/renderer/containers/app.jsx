import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { CONFIG } from '../api';
import * as ConfigActions from '../actions/config';
import imageSrc from './sqlectron.gif';

import '../../../vendor/renderer/semantic-ui/semantic';
import { sqlectron } from '../api';
import * as eventKeys from '../../common/event';
import { mapObjectToConfig } from '../utils/config';
import MenuHandler from '../utils/menu';

require('../../../vendor/renderer/lato/latofonts.css');
require('../../../vendor/renderer/semantic-ui/semantic.css');
require('./app.css');

const preventDefault = (e) => e.preventDefault();

class AppContainer extends Component {
  static propTypes = {
    config: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    children: PropTypes.node,
  };

  constructor(props) {
    super(props);
    this.state = {};
    this.menuHandler = new MenuHandler();
  }

  UNSAFE_componentWillMount() {
    this.props.dispatch(ConfigActions.loadConfig());
  }

  componentDidMount() {
    // Prevent drag and drop causing redirect
    document.addEventListener('dragover', preventDefault, false);
    document.addEventListener('drop', preventDefault, false);

    const updateConfig = async (data) => {
      const { dispatch } = this.props;
      await dispatch(ConfigActions.saveConfig(mapObjectToConfig(data)));
      dispatch(ConfigActions.finishEditing());
    };

    this.menuHandler.setMenus({
      [eventKeys.BROWSER_MENU_ZOOM_IN]: () => {
        const { config } = this.props;
        if (!config.data) {
          return;
        }
        const { data } = config;
        data.zoomFactor = (data.zoomFactor || 1) + 0.2;
        updateConfig(data);
      },
      [eventKeys.BROWSER_MENU_ZOOM_OUT]: () => {
        const { config } = this.props;
        if (!config.data) {
          return;
        }
        const { data } = config;
        data.zoomFactor = (data.zoomFactor || 1) - 0.2;
        updateConfig(data);
      },
      [eventKeys.BROWSER_MENU_ZOOM_RESET]: () => {
        const { config } = this.props;
        if (!config.data) {
          return;
        }
        const { data } = config;
        data.zoomFactor = 1;
        updateConfig(data);
      },
    });
  }

  UNSAFE_componentWillReceiveProps(newProps) {
    const { config } = newProps;
    if (!config.data) {
      return;
    }
    const { zoomFactor, enabledDarkTheme, disabledOpenAnimation } = config.data;
    if (typeof zoomFactor !== 'undefined' && zoomFactor > 0) {
      // Apply the zoom factor
      // Required for HiDPI support
      sqlectron.browser.webFrame.setZoomFactor(zoomFactor);
    }
    if (enabledDarkTheme === true) {
      $('body').addClass('dark-theme');
    } else {
      $('body').removeClass('dark-theme');
    }

    // remove the loading screen quickly if disabled
    const l1 = document.getElementById('loading');
    const l2 = document.getElementById('loading-signal');
    const l3 = document.getElementById('loading-started');
    if (l1 && l2 && l3 && disabledOpenAnimation) {
      l1.remove();
      l2.remove();
    }
    if (l1 && l2 && l3 && !disabledOpenAnimation) {
      this.runLoadingAnimation();
    }
  }

  componentWillUnmount() {
    document.removeEventListener('dragover', preventDefault, false);
    document.removeEventListener('drop', preventDefault, false);

    if (this.menuHandler) {
      this.menuHandler.dispose();
    }
  }

  // this runs the animated loading
  runLoadingAnimation() {
    document.getElementById('loading-started').remove();

    const img = new Image();

    img.onload = () => {
      setTimeout(() => {
        const loadingWrapper = document.getElementById('loading');
        const loadingInner = document.createElement('div');

        const version = document.createElement('H3');
        version.appendChild(document.createTextNode(`v${CONFIG.version}`));

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
      const customFont = config.data.customFont || 'Lato';
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
