import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import shell from 'shell';


const LOGO_PATH = require('./logo-200px.png');


function onGithubClick(event) {
  event.preventDefault();
  shell.openExternal('https://github.com/sqlectron/sqlectron-gui');
}


function renderBreadcrumb(items) {
  return (
    <div className="ui breadcrumb">
      {items.map(({icon, label}, index) => {
        const isLast = (index !== items.length - 1);
        return (
          <span key={index + label}>
            <i className={`${icon} icon`}></i>
            <a className={`section ${isLast ? 'active' : ''}`}>
              {label}
            </a>
            {isLast && <div className="divider"> / </div>}
          </span>
        );
      })}
    </div>
  );
}


const Header = ({ items, includeButtonCloseConn = false }) => {
  return (
    <div className="ui top fixed menu borderless">
      <a href="#" className="item" onClick={onGithubClick}>
        <img src={LOGO_PATH} style={{width: '5.5em'}} />
      </a>
      <div style={{margin: '0 auto'}}>
        <div className="item borderless" style={{marginLeft: '-109px'}}>
          {renderBreadcrumb(items)}
        </div>
      </div>
      {includeButtonCloseConn && <div className="right menu" style={{marginLeft: '0 !important'}}>
        <div className="item borderless">
          <Link to="/" className="ui icon button" title="Sign out server">
            <i className="sign out icon"></i>
          </Link>
        </div>
      </div>}
    </div>
  );
};


Header.propTypes = {
  items: PropTypes.array.isRequired,
  includeButtonCloseConn: PropTypes.bool,
};


export default Header;
