import { ComponentStory, ComponentMeta } from '@storybook/react';
import { TestAutoConfigSize } from './TestAutoConfigSize';

export default {
  title: 'GExpression-Render/TestAutoConfigSize',
  component: TestAutoConfigSize,
  argTypes: {},
} as ComponentMeta<typeof TestAutoConfigSize>;

const Template: ComponentStory<typeof TestAutoConfigSize> = (args) => <TestAutoConfigSize {...args} />;

export const Primary = Template.bind({});

Primary.args = {
  json: {
    type: "GSum",
    startDirection: "left",
    gSummands: [
      {
        type: 'GValue',
        mValue: "8",
        numericValue: 8,
        xEdge: "bottom",
        yEdge: "left",
      },
      {
        type: 'GValue',
        mValue: "12",
        numericValue: 12,
        xEdge: "bottom",
        yEdge: "left",
      }
    ],
  },

  layerTransformation: { x: 30, y: 30, scaleX: 20, scaleY: 20 }
};
