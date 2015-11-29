import { ipcRenderer } from 'electron';
import shell from 'shell';
import React, {Component} from 'react';


const EVENT_KEY = 'sqlectron:update-available';


export default class UpdateChecker extends Component {
  componentDidMount() {
    ipcRenderer.on(EVENT_KEY, ::this.onUpdateAvailable);
  }

  componentWillUnmount() {
    ipcRenderer.removeListener(EVENT_KEY, ::this.onUpdateAvailable);
  }

  onUpdateAvailable() {
    this.setState({ isVisible: true });
  }

  onUpdateClick(event) {
    event.preventDefault();
    shell.openExternal('https://github.com/sqlectron/sqlectron-gui-test-auto-update/releases/latest');
  }

  render() {
    const isVisible = this.state && this.state.isVisible;
    if (!isVisible) { return null; }

    return (
      <a className="ui green label" onClick={this.onUpdateClick}>
        <i className="cloud download icon" />
        Update available
        <div className="detail">v1.1.1</div>
      </a>
    );
  }
}
