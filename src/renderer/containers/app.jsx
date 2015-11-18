import React, { Component, PropTypes } from 'react';


import '../vendor/semantic-ui/semantic';
require('../vendor/lato/latofonts.css');
require('../vendor/semantic-ui/semantic.css');
require('./app.css');


export default class AppContainer extends Component {
  static propTypes = {
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
  };

  componentDidMount() {
    // wait a bit more until remove the splash screen
    setTimeout(() => document.getElementById('loading').remove(), 2000);
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
