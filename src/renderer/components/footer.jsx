import React, { PropTypes } from 'react';


const STYLE = {
  footer: { minHeight: 'auto' },
};


const Footer = ({ status }) => {
  return (
    <div className="ui bottom fixed menu borderless" style={STYLE.footer}>
      {status}
    </div>
  );
};


Footer.propTypes = {
  status: PropTypes.string.isRequired,
};


export default Footer;
