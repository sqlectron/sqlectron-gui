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
  children: PropTypes.node,
};

export default AppContainer;
