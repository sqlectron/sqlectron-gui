import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, /*hashHistory*/ } from 'react-router';
import { HashRouter,  } from 'react-router-dom';
import App from './containers/app.jsx';
import configureStore from './store/configure';
import ServerManagementContainer from './containers/server-management.jsx';
import QueryBrowserContainer from './containers/query-browser.jsx';


const store = configureStore();


ReactDOM.render(
  <Provider store={store}>
    {/*<Router history={hashHistory}>*/}
    <HashRouter>
      <Route component={App}>
        <Route path="/" component={ServerManagementContainer} />
        <Route path="/server/:id" component={QueryBrowserContainer} />
      </Route>
    </HashRouter>
    {/*</Router>*/}
  </Provider>,
  document.getElementById('content')
);
