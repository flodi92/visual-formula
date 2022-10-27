import { ComponentStory, ComponentMeta } from '@storybook/react';
import { TestGValue } from './TestGValue';

export default {
  title: 'Example/TestGValue',
  component: TestGValue,
  argTypes: {},
} as ComponentMeta<typeof TestGValue>;

const Template: ComponentStory<typeof TestGValue> = (args) => <TestGValue {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  xEdge: "bottom", yEdge: "left",
  unscaledWidth: 4, unscaledHeight: 2,
  x: 30, y: 30, scaleX: 20, scaleY: 20 
};

export const ZeroWidth = Template.bind({});
ZeroWidth.args = {
  xEdge: "bottom", yEdge: "left",
  unscaledWidth: 0, unscaledHeight: 2,
  x: 30, y: 30, scaleX: 20, scaleY: 20 
};

export const ZeroHeight = Template.bind({});
ZeroHeight.args = {
  xEdge: "bottom", yEdge: "left",
  unscaledWidth: 4, unscaledHeight: 0,
  x: 30, y: 30, scaleX: 20, scaleY: 20 
};