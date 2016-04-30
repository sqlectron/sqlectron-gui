import 'babel-polyfill';
import React from 'react';
import { Provider } from 'react-redux';
import createHashHistory from 'history/lib/createHashHistory';
import { Router, Route } from 'react-router';
import App from './containers/app.jsx';
import configureStore from './store/configure';
import ServerManagementContainer from './containers/server-management.jsx';
import QueryBrowserContainer from './containers/query-browser.jsx';


const history = createHashHistory();
const store = configureStore();

const Root = (
  <Provider store={store}>
    <Router history={history}>
      <Route component={App}>
        <Route path="/" component={ServerManagementContainer} />
        <Route path="/server/:id" component={QueryBrowserContainer} />
      </Route>
    </Router>
  </Provider>
);

export default Root;
