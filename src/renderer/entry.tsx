import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import App from './containers/app';
import { store } from './store/configure';
import ServerManagementContainer from './containers/server-management';
import QueryBrowserContainer from './containers/query-browser';

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <App>
        <Switch>
          <Route exact path="/" component={ServerManagementContainer} />
          <Route path="/server/:id" component={QueryBrowserContainer} />
        </Switch>
      </App>
    </Router>
  </Provider>,
  document.getElementById('content'),
);
