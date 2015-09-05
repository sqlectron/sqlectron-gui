import React, {Component, PropTypes} from 'react';
import { connect, bindActions } from 'redux';

import DialogActions from '../actions/DialogActions.jsx';

import App from '../App.jsx';

@connect(state => {
  return {
    dialog: state.dialog,
  };
})
export default class AppController extends Component {

  render() {
    const {dialog, dispatcher} = this.props;
    const actions = bindActions(DialogActions, dispatcher);
    return <App {...{dialog}} {...actions} />;
  }

}
