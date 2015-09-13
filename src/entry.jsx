import React from 'react';
import { Provider } from 'react-redux';
import createHashHistory from 'history/lib/createHashHistory'
import { Router, Route } from 'react-router';
import App from './containers/app.jsx';
import configureStore from './store/configure';
import ConnectionListContainer from './containers/connection-list.jsx';
import ConnectionContainer from './containers/connection.jsx';

const history = createHashHistory();
const store = configureStore();

React.render(
  <Provider store={store}>
    {() =>
      <Router history={history}>
        <Route component={App}>
          <Route path="/" component={ConnectionListContainer} />
          <Route path="/:name" component={ConnectionContainer} />
        </Route>
      </Router>
    }
  </Provider>,
  document.getElementById('content')
);
