import React, { PropTypes } from 'react';


import '../vendor/semantic-ui/semantic';
require('../vendor/lato/latofonts.css');
require('../vendor/semantic-ui/semantic.css');
require('./app.css');


const AppContainer = ({ children }) => (
  <div className="ui">
    {children}
  </div>
);

AppContainer.propTypes = {
  history: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired,
  routeParams: PropTypes.object.isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }),
  children: PropTypes.node,
};

AppContainer.contextTypes = {
  history: PropTypes.object.isRequired,
};

export default AppContainer;
