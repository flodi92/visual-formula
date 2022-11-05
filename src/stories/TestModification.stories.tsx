import { ComponentStory, ComponentMeta } from '@storybook/react';
import { TestModification } from './TestModification';

export default {
  title: 'GExpression-Render/TestModification',
  component: TestModification,
  argTypes: {},
} as ComponentMeta<typeof TestModification>;

const Template: ComponentStory<typeof TestModification> = (args) => <TestModification {...args} />;

export const Primary = Template.bind({});

Primary.args = {
  json: {
    type: "GSum",
    startDirection: "left",
    gSummands: [
      {
        type: 'GValue',
        mValue: "2",
        numericValue: 1,
        xEdge: "bottom",
        yEdge: "left",

        unscaledWidth: 4,
        unscaledHeight: 2,
      },
      {
        type: 'GValue',
        mValue: "2",
        numericValue: 1,
        xEdge: "bottom",
        yEdge: "left",

        unscaledWidth: 6,
        unscaledHeight: 2,
      }
    ],
  },

  layerTransformation: { x: 30, y: 30, scaleX: 20, scaleY: 20 }
};

export const GDifferenceExample = Template.bind({});

GDifferenceExample.args = {
  json: {
    type: "GDifference",
    startDirection: "right",
    gMinuend: {
      type: 'GValue',
      mValue: "2",
      numericValue: 1,
      xEdge: "top",
      yEdge: "right",

      unscaledWidth: 4,
      unscaledHeight: 2,
    },
    gSubtrahend: {
      type: 'GValue',
      mValue: "2",
      numericValue: 1,
      xEdge: "bottom",
      yEdge: "left",

      unscaledWidth: 6,
      unscaledHeight: 2,
    }
  },

  layerTransformation: { x: 30, y: 30, scaleX: 20, scaleY: 20 }
};
