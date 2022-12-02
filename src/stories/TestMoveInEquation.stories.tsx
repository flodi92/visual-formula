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
  modification:'moveSummand',
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

export const Difference = Template.bind({});

Difference.args = {
  doModification: true,
  modification:'moveSubtrahend',
  id: 42,

  json: {
    type: "GEquation",
    gTerm1: {
      type: "GDifference",
      gMinuend: {
        type: "GSum",
        gSummands: [
          {
            type: "GValue",
            mValue: "4",
            xEdge: "top",
            yEdge: "right",
            unscaledWidth: 2,
            unscaledHeight: 2,
            numericValue: 4,
            id: 45
          },
          {
            type: "GValue",
            mValue: "6",
            xEdge: "top",
            yEdge: "right",
            unscaledWidth: 3,
            unscaledHeight: 2,
            numericValue: 6,
            id: 47
          },
          {
            type: "GValue",
            mValue: "8",
            xEdge: "top",
            yEdge: "right",
            unscaledWidth: 4,
            unscaledHeight: 2,
            numericValue: 8,
            id: 49
          }
        ],
        startDirection: "right",
        id: 44
      },
      gSubtrahend: {
        type: "GValue",
        mValue: "6",
        xEdge: "bottom",
        yEdge: "left",
        unscaledWidth: 3,
        unscaledHeight: 2,
        numericValue: 6,
        id: 42
      },
      startDirection: "left"
    },
    gTerm2: {
      type: "GSum",
      gSummands: [
        {
          type: "GValue",
          mValue: "5",
          xEdge: "bottom",
          yEdge: "left",
          unscaledWidth: 2.5,
          unscaledHeight: 2,
          numericValue: 5,
          id: 53
        },
        {
          type: "GValue",
          mValue: "7",
          xEdge: "bottom",
          yEdge: "left",
          unscaledWidth: 3.5,
          unscaledHeight: 2,
          numericValue: 7,
          id: 55
        }
      ],
      startDirection: "right",
      id: 51
    },
    id: 43
  },

  layerTransformation: { x: 30, y: 30, scaleX: 20, scaleY: 20 }
};
