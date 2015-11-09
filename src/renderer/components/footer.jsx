import React, { PropTypes } from 'react';
import shell from 'shell';


const STYLE = {
  footer: { minHeight: 'auto' },
  status: { paddingLeft: '0.5em' },
};


function onGithubClick(event) {
  event.preventDefault();
  shell.openExternal('https://github.com/sqlectron/sqlectron-gui');
}


const Footer = ({ status }) => {
  return (
    <div className="ui bottom fixed menu borderless" style={STYLE.footer}>
      <div style={STYLE.status}>{status}</div>
      <div className="right menu">
        <a href="#" className="item" onClick={onGithubClick}>Github</a>
      </div>
    </div>
  );
};


Footer.propTypes = {
  status: PropTypes.string.isRequired,
};


export default Footer;
