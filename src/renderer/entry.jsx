import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Route, Switch, HashRouter as Router } from 'react-router-dom';
import App from './containers/app';
import configureStore from './store/configure';
import ServerManagementContainer from './containers/server-management';
import QueryBrowserContainer from './containers/query-browser';

const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <Router>
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
