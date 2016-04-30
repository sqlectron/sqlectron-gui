import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import Root from './app-root';
import configureStore from './store/configure';


const store = configureStore();


ReactDOM.render(
  <AppContainer
    component={Root}
    props={{ store }}
  />,
  document.getElementById('content')
);


if (module.hot) {
  module.hot.accept('./app-root', () => {
    ReactDOM.render(
      <AppContainer
        component={require('./app-root').default}
        props={{ store }}
      />,
      document.getElementById('content')
    );
  });
}
