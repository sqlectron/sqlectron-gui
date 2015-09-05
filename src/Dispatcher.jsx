import React, {Component, PropTypes} from 'react';
import {createDispatcher, Provider, composeStores} from 'redux';

import * as stores from './stores/index.js';

import App from './App.jsx';

const dispatcher = createDispatcher(composeStores(stores));

export default class Dispatcher extends Component {

  render() {
    return <Provider dispatcher={dispatcher}>
      {() => <App /> }
    </Provider>
  }

}
