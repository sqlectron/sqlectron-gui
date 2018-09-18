import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, Switch } from 'react-router-dom';
import createHashHistory from 'history/createHashHistory';
import App from './containers/app';
import configureStore from './store/configure';
import ServerManagementContainer from './containers/server-management';
import QueryBrowserContainer from './containers/query-browser';

const store = configureStore();
const hashHistory = createHashHistory();

ReactDOM.render(
  <Provider store={store}>
    <Router history={hashHistory}>
      <App>
        <Switch>
          <Route exact path='/server/:id' component={QueryBrowserContainer} />
          <Route exact path='/' component={ServerManagementContainer} />
        </Switch>
      </App>
    </Router>
  </Provider>,
  document.getElementById('content')
);
