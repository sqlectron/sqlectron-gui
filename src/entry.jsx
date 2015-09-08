import React from 'react';
import { Provider } from 'react-redux';
import App from './containers/app.jsx';
import configureStore from './store/configure';

const store = configureStore();

React.render(
  <Provider store={store}>
    {() => <App />}
  </Provider>,
  document.getElementById('content')
);
