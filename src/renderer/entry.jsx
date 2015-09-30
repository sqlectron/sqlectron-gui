import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import createHashHistory from 'history/lib/createHashHistory'
import { Router, Route } from 'react-router';
import App from './containers/app.jsx';
import configureStore from './store/configure';
import ConnectionManagementContainer from './containers/connection-management.jsx';
import QueryBrowserContainer from './containers/query-browser.jsx';

const history = createHashHistory();
const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Route component={App}>
        <Route path="/" component={ConnectionManagementContainer} />
        <Route path="/:name" component={QueryBrowserContainer} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('content')
);
