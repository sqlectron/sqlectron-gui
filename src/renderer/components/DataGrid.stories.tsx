import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0';

import { DataGrid, DataGridProps } from './DataGrid';

export default {
  title: 'Components/DataGrid',
  component: DataGrid,
} as Meta;

const Template: Story<DataGridProps> = (args) => <DataGrid {...args} />;

export const PopulatedGrid = Template.bind({});
