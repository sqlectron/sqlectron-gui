// import '@babel/polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route } from 'react-router';
import createHashHistory from 'history/createHashHistory';
import App from './containers/app';
import configureStore from './store/configure';
import ServerManagementContainer from './containers/server-management';
import QueryBrowserContainer from './containers/query-browser';

const store = configureStore();
const hashHistory = createHashHistory();

const AppContainer = (props) => (
  <App props={props}>
    <Route path='/' component={ServerManagementContainer} />
    <Route path='/server/:id' component={QueryBrowserContainer} />
  </App>
);

ReactDOM.render(
  <Provider store={store}>
    <Router history={hashHistory}>
      <Route component={AppContainer} />
      {/*
      <Route component={App}>
        <Route path='/' component={ServerManagementContainer} />
        <Route path='/server/:id' component={QueryBrowserContainer} />
      </Route>
      */}
    </Router>
  </Provider>,
  document.getElementById('content')
);
