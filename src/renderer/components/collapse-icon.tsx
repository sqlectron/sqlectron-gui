import React, { FC } from 'react';

interface CollapseIconProps {
  arrowDirection: 'down' | 'right';
  expandAction: () => void;
}

const CollapseIcon: FC<CollapseIconProps> = ({ arrowDirection, expandAction }) => (
  <i
    className={`${arrowDirection} triangle icon`}
    style={{ float: 'left', margin: '0 0.15em 0 -1em' }}
    onClick={expandAction}
  />
);

export default CollapseIcon;
