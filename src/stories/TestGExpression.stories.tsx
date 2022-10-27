import { ComponentStory, ComponentMeta } from '@storybook/react';
import { TestGExpression } from './TestGExpression';

export default {
  title: 'GExpression-Render/TestGExpression',
  component: TestGExpression,
  argTypes: {},
} as ComponentMeta<typeof TestGExpression>;

const Template: ComponentStory<typeof TestGExpression> = (args) => <TestGExpression {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  type: "GSum",
  startDirection: 'left',
  width1: 4,
  height1: 2,
  width2: 8,
  height2: 2,
};
