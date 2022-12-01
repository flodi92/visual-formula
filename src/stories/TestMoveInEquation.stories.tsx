import { ComponentStory, ComponentMeta } from '@storybook/react';
import { TestMoveInEquation } from './TestMoveInEquation';

export default {
  title: 'GExpression-Render/TestMoveInEquation',
  component: TestMoveInEquation,
  argTypes: {},
} as ComponentMeta<typeof TestMoveInEquation>;

const Template: ComponentStory<typeof TestMoveInEquation> = (args) => <TestMoveInEquation {...args} />;

export const Primary = Template.bind({});

Primary.args = {
  doModification: true,
  id: 42,
  json: {
    type: "GEquation",
    gTerm1: {
      type: "GSum",
      startDirection: "left",
      gSummands: [
        {
          type: 'GValue',
          mValue: "4",
          numericValue: 4,
          xEdge: "bottom",
          yEdge: "left",

          unscaledWidth: 2,
          unscaledHeight: 2,
        },
        {
          type: 'GValue',
          mValue: "6",
          numericValue: 6,
          xEdge: "bottom",
          yEdge: "left",

          unscaledWidth: 3,
          unscaledHeight: 2,
        },
        {
          type: 'GValue',
          mValue: "8",
          numericValue: 8,
          xEdge: "bottom",
          yEdge: "left",

          unscaledWidth: 4,
          unscaledHeight: 2,
        },
      ],
    },
    gTerm2: {
      type: "GSum",
      startDirection: "left",
      gSummands: [
        {
          id: 42,
          type: 'GValue',
          mValue: "6",
          numericValue: 6,
          xEdge: "top",
          yEdge: "right",

          unscaledWidth: 3,
          unscaledHeight: 2,
        },
        {
          type: 'GValue',
          mValue: "5",
          numericValue: 5,
          xEdge: "top",
          yEdge: "right",

          unscaledWidth: 2.5,
          unscaledHeight: 2,
        },
        {
          type: 'GValue',
          mValue: "7",
          numericValue: 7,
          xEdge: "top",
          yEdge: "right",

          unscaledWidth: 3.5,
          unscaledHeight: 2,
        },
      ],
    },
  },

  layerTransformation: { x: 30, y: 30, scaleX: 20, scaleY: 20 }
};
