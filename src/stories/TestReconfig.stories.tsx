import { ComponentStory, ComponentMeta } from '@storybook/react';
import { TestReconfig } from './TestReconfig';

export default {
  title: 'GExpression-Render/TestReconfig',
  component: TestReconfig,
  argTypes: {},
} as ComponentMeta<typeof TestReconfig>;

const Template: ComponentStory<typeof TestReconfig> = (args) => <TestReconfig {...args} />;

const json = {
  type: "GEquation",
  id: 42,
  gTerm1: {
    type: "GSum",
    id: 45,
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
        type: 'GValue',
        mValue: "6",
        numericValue: 6,
        xEdge: "top",
        yEdge: "right",

        unscaledWidth: 3,
        unscaledHeight: 2,
      },
      {
        id: 44,
        type: 'GValue',
        mValue: "5",
        numericValue: 5,
        xEdge: "top",
        yEdge: "right",

        unscaledWidth: 2.5,
        unscaledHeight: 2,
      },
      {
        id: 43,
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
};

export const Primary = Template.bind({});

Primary.args = {
  steps: 1,
  modificationID: [['swapXToY', { id: 42 }], ['swapXToY', { id: 42 }]],
  json,
  layerTransformation: { x: 30, y: 30, scaleX: 20, scaleY: 20 }
};

export const Reverse = Template.bind({});

Reverse.args = {
  steps: 1,
  modificationID: [['reverse', { id: 42, xy: 'X' }], ['reverse', { id: 42, xy: 'X' }]],
  json,
  layerTransformation: { x: 30, y: 30, scaleX: 20, scaleY: 20 }
};

export const Substitute = Template.bind({});

Substitute.args = {
  steps: 1,
  modificationID: [['substitute', { id: 45 }]],
  json,
  layerTransformation: { x: 30, y: 30, scaleX: 20, scaleY: 20 }
};

