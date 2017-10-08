import React, { Component, PropTypes } from 'react';
import Select from 'react-select';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import * as ConfigActions from '../actions/config.js';
import Checkbox from '../components/checkbox.jsx';
import Header from '../components/header.jsx';
import Footer from '../components/footer.jsx';

require('react-select/dist/react-select.css');

const STYLES = {
  wrapper: { paddingTop: '50px' },
  container: { padding: '10px 10px 50px 10px' },
};


const BREADCRUMB = [{ icon: 'settings', label: 'settings' }];


class SettingsContainer extends Component {
  static propTypes = {
    status: PropTypes.string.isRequired,
    config: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    router: PropTypes.object.isRequired,
    children: PropTypes.node,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      ...props.config.data,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.config.isSaving &&
      !nextProps.config.isSaving &&
      !nextProps.config.error) {
      this.props.router.push('/');
      return;
    }

    this.setState({ ...nextProps.config.data });
  }

  onSaveClick() {
    const config = this.mapStatetoConfig(this.state);
    const { dispatch } = this.props;
    dispatch(ConfigActions.saveConfig(config));
  }

  onCancelClick() {
    this.props.router.push('/');
  }

  highlightError(name) {
    const { error } = this.state;
    let hasError = !!(error && error[name]);
    if (error && error.ssh && /^ssh\./.test(name)) {
      const sshErrors = error.ssh[0].errors[0];
      const lastName = name.replace(/^ssh\./, '');
      hasError = !!~Object.keys(sshErrors).indexOf(lastName);
    }
    return hasError ? 'error' : '';
  }

  handleChange(event) {
    const newState = {};
    const { target } = event;
    const value = target.files ? target.files[0].path : target.value;
    const [name1, name2] = target.name.replace(/^file\./, '').split('.');

    if (name1 === 'log') {
      newState.log = { ...this.state.log, [name2]: value };
    } else {
      newState[name1] = value;
    }

    return this.setState(newState);
  }

  handleOnLogLevelChange(level) {
    this.setState({ log: { level } });
  }

  mapStatetoConfig(state) {
    const config = {
      zoomFactor: parseFloat(state.zoomFactor) || 1,
      limitQueryDefaultSelectTop: parseInt(state.limitQueryDefaultSelectTop, 10) || 100,
      enabledAutoComplete: state.enabledAutoComplete || false,
      enabledLiveAutoComplete: state.enabledLiveAutoComplete || false,
    };
    if (!this.state.log) { return config; }

    const { log } = state;
    config.log = {
      console: log.console,
      file: log.file,
      level: log.level,
      path: log.path,
    };

    return config;
  }

  renderActionsPanel() {
    return (
      <div className="actions">

        <div className="small ui black deny right labeled icon button"
          tabIndex="0"
          onClick={::this.onCancelClick}>
          Cancel
          <i className="ban icon"></i>
        </div>
        <div className="small ui green right labeled icon button"
          tabIndex="0"
          onClick={::this.onSaveClick}>
          Save
          <i className="checkmark icon"></i>
        </div>
      </div>
    );
  }

  renderLogLevelItem({ label, icon }) {
    return (
      <span>
        <i className={`icon ${icon}`}></i> {label}
      </span>
    );
  }

  renderBasicSettingsPanel() {
    return (
      <div>
        <div className="two fields">
          <div className={`field ${this.highlightError('zoomFactor')}`}>
            <label>Zoom Factor</label>
            <input type="number"
              name="zoomFactor"
              value={this.state.zoomFactor || ''}
              onChange={::this.handleChange} />
            <p className="help">Changes the zoom factor to the specified factor. Zoom factor is zoom percent divided by 100, so 300% = 3.0.</p>
          </div>
          <div className={`field ${this.highlightError('limitQueryDefaultSelectTop')}`}>
            <label>Limit of Rows from Select Top Query</label>
            <input type="number"
              name="limitQueryDefaultSelectTop"
              value={this.state.limitQueryDefaultSelectTop || ''}
              onChange={::this.handleChange} />
            <p className="help">Change the limit used in the default select.
            </p>
          </div>
        </div>

        <div className="two fields">
          <div className="field">
            <Checkbox
              name="enabledAutoComplete"
              label="Enabled Auto Complete"
              defaultChecked={this.state.enabledAutoComplete}
              onChecked={() => this.setState({ enabledAutoComplete: true })}
              onUnchecked={() => this.setState({ enabledAutoComplete: false })} />
            <p className="help">Enable/Disable auto complete for the query box.</p>
          </div>
          <div className="field">
            <Checkbox
              name="enabledLiveAutoComplete"
              label="Enabled Live Auto Complete"
              defaultChecked={this.state.enabledLiveAutoComplete}
              onChecked={() => this.setState({ enabledLiveAutoComplete: true })}
              onUnchecked={() => this.setState({ enabledLiveAutoComplete: false })} />
            <p className="help">Enable/Disable live auto complete for the query box.</p>
          </div>
        </div>
      </div>
    );
  }

  renderLoggingSettingsPanel() {
    const log = this.state.log || {};
    return (
      <div className="ui segment">
        <div className="one field">
          Logging
        </div>
        <div>
          <div className="two fields">
            <div className="field">
              <Checkbox
                name="log.console"
                label="Console"
                defaultChecked={log.console}
                onChecked={() => this.handleChange({
                  target: { name: 'log.console', value: true },
                })}
                onUnchecked={() => this.handleChange({
                  target: { name: 'log.console', value: false },
                })} />
              <p className="help">Show logs in the dev tools panel.</p>
            </div>

            <div className="field">
              <Checkbox
                name="log.file"
                label="File"
                defaultChecked={log.file}
                onChecked={() => this.handleChange({
                  target: { name: 'log.file', value: true },
                })}
                onUnchecked={() => this.handleChange({
                  target: { name: 'log.file', value: false },
                })} />
              <p className="help">Save logs into a file.</p>
            </div>
          </div>

          <div className="two fields">
            <div className={`field ${this.highlightError('log.path')}`}>
              <label>Path</label>
              <div className="ui action input">
                <input type="text"
                  name="log.path"
                  placeholder="~/.sqlectron.log"
                  value={log.path || ''}
                  onChange={::this.handleChange} />
                <label htmlFor="file.log.path" className="ui icon button btn-file">
                  <i className="file outline icon" />
                  <input
                    type="file"
                    id="file.log.path"
                    name="file.log.path"
                    onChange={::this.handleChange}
                    style={{ display: 'none' }} />
                </label>
              </div>
              <p className="help">Level logging: debug, info, warn, error "error"</p>
            </div>
            <div id="logLevel" className={`field ${this.highlightError('log.level')}`}>
              <label>Level</label>
              <Select
                name="log.level"
                options={[
                  { value: 'debug', label: 'Debug', icon: 'bug' },
                  { value: 'info', label: 'Info', icon: 'info' },
                  { value: 'warn', label: 'Warn', icon: 'warning sign' },
                  { value: 'error', label: 'Error', icon: 'remove circle' },
                ]}
                clearable={false}
                onChange={::this.handleOnLogLevelChange}
                optionRenderer={this.renderLogLevelItem}
                valueRenderer={this.renderLogLevelItem}
                value={log.level || 'error'} />
              <p className="help">Level logging: debug, info, warn, error."error"</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div style={STYLES.wrapper}>
        <div style={STYLES.header}>
          <Header items={BREADCRUMB} />
        </div>
        <div style={STYLES.container}>

          <form className="ui form">
            {this.renderBasicSettingsPanel()}
            {this.renderLoggingSettingsPanel()}
            {this.renderActionsPanel()}
          </form>
        </div>
        <div style={STYLES.footer}>
          <Footer status={status} />
        </div>
      </div>
    );
  }
}


function mapStateToProps(state) {
  return {
    config: state.config,
    status: state.status,
  };
}

export default connect(mapStateToProps)(withRouter(SettingsContainer));
