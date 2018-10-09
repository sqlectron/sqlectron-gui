import React, { PropTypes } from 'react';

const CollapseIcon = ({ arrowDirection, expandAction }) =>
  (<i
    className={`${arrowDirection} triangle icon`}
    style={{ float: 'left', margin: '0 0.15em 0 -1em' }}
    onClick={expandAction}
  />);

CollapseIcon.propTypes = {
  arrowDirection: PropTypes.string.isRequired,
  expandAction: PropTypes.func.isRequired,
};

export default CollapseIcon;
