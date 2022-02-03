// This is a copy of the TabList from react-tabs, with addition of forwardRef so we can
// calculate the width of the tab list in QueryTabs.
import React, { CSSProperties, forwardRef, PropsWithChildren } from 'react';

interface Props {
  className?: string;
  style?: CSSProperties;
}

const TabList = forwardRef<HTMLUListElement, PropsWithChildren<Props>>(
  ({ children, className = 'react-tabs__tab-list', style }, ref) => {
    return (
      <ul ref={ref} className={className} style={style} role="tablist">
        {children}
      </ul>
    );
  },
);

TabList.displayName = 'TabList';

// Required to set `tabsRole` on the component so its understood properly by react-tabs
// @ts-ignore
TabList.tabsRole = 'TabList';

export default TabList;
