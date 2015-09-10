import React from 'react';
import { Provider } from 'react-redux';
import createHashHistory from 'history/lib/createHashHistory'
import { Router, Route } from 'react-router';
import App from './containers/App.jsx';
import configureStore from './store/configureStore';
import ConnectionsContainer from './containers/Connections.jsx';
import DatabaseListContainer from './containers/DatabaseList.jsx';

const history = createHashHistory();
const store = configureStore();

React.render(
  <Provider store={store}>
    {() =>
      <Router history={history}>
        <Route component={App}>
          <Route path="/" component={ConnectionsContainer} />
          <Route path="/databases" component={DatabaseListContainer} />
        </Route>
      </Router>
    }
  </Provider>,
  document.getElementById('content')
);
