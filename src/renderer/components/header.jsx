import React, {Component} from 'react';
import { Link } from 'react-router';


export default class Header extends Component {

  render() {
    return (
      <div className="ui top fixed menu borderless">
        <div className="item">
          <img src="https://raw.githubusercontent.com/krolow/sqlectron/feature/adding-connection-screen/public/images/logo.png" style={{width: '5.5em'}} />
        </div>
        <div style={{margin: '0 auto'}}>
          <div className="item borderless">
            <div className="ui breadcrumb">
              <i className="server icon"></i>
              <a className="section">server-name</a>
              <div className="divider"> / </div>
              <i className="database icon"></i>
              <div className="active section">database-name</div>
            </div>
          </div>
        </div>
        <div className="right menu" style={{marginLeft: '0 !important'}}>
          <div className="item borderless">
            <Link to="/" className="ui icon button" title="Close connection">
              <i className="ban icon"></i>
            </Link>
          </div>
        </div>
      </div>
    );
  }

};
