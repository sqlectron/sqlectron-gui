import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import createHashHistory from 'history/lib/createHashHistory';
import { Router, Route } from 'react-router';
import App from './containers/app.jsx';
import configureStore from './store/configure';
import ServerManagementContainer from './containers/server-management.jsx';
// import QueryBrowserContainer from './containers/query-browser.jsx';
import ConnectionContainer from './containers/connection.jsx';
import DatabaseContainer from './containers/database.jsx';


const history = createHashHistory();
const store = configureStore();


ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Route component={App}>
        <Route path="/" component={ServerManagementContainer} />
        {/* <Route path="/server/:id" component={QueryBrowserContainer} />*/}
        <Route component={ConnectionContainer}>
          <Route path="/server/:id/database/:database" component={DatabaseContainer} />
        </Route>
      </Route>
    </Router>
  </Provider>,
  document.getElementById('content')
);
