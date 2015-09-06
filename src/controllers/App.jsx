import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as DialogActions from '../actions/dialog';
import App from '../App.jsx';

class AppController extends Component {
  static propTypes = {
    dialog: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired
  }

  render() {
    const { dialog, dispatch } = this.props;
    const actions = bindActionCreators(DialogActions, dispatch);

    return (
      <div>
        <App dialog={dialog} actions={actions} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    dialog: state.dialog
  };
}

export default connect(mapStateToProps)(AppController);
