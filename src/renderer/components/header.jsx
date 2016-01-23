import React, { PropTypes } from 'react';
import shell from 'shell';


const LOGO_PATH = require('./logo-128px.png');


function onSiteClick(event) {
  event.preventDefault();
  shell.openExternal('https://sqlectron.github.io');
}


function renderBreadcrumb(items) {
  return (
    <div className="ui breadcrumb" style={{margin: '0 auto'}}>
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


const Header = ({ items, onCloseConnectionClick }) => {
  const visibilityLeaveButton = onCloseConnectionClick ? 'visible' : 'hidden';
  return (
    <div className="ui top fixed menu borderless">
      <a href="#" className="item" onClick={onSiteClick}>
        <img src={LOGO_PATH} style={{width: '5.5em'}} />
      </a>
      <div style={{margin: '0 auto'}}>
        <div className="item" style={{marginLeft: '-109px', marginRight: '-70px'}}>
          {renderBreadcrumb(items)}
        </div>
      </div>
      <div className="right menu" style={{marginLeft: '0 !important', visibility: visibilityLeaveButton}}>
        <div className="item borderless">
          <button className="ui icon button"
            title="Close connection"
            onClick={onCloseConnectionClick}>
            <i className="ban icon"></i>
          </button>
        </div>
      </div>
    </div>
  );
};


Header.propTypes = {
  items: PropTypes.array.isRequired,
  onCloseConnectionClick: PropTypes.func,
};


export default Header;
