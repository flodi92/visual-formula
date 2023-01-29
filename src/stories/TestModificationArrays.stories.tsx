import { ComponentStory, ComponentMeta } from '@storybook/react';
import { TestModificationArrays } from './TestModificationArrays';

export default {
  title: 'GExpression-Render/TestModificationArrays',
  component: TestModificationArrays,
  argTypes: {},
} as ComponentMeta<typeof TestModificationArrays>;

const Template: ComponentStory<typeof TestModificationArrays> = (args) => <TestModificationArrays {...args} />;

const json1 = {
  type: "GEquation",
  id: 41,
  gTerm1: {
    type: "GQuotient2D",
    id: 42,
    gDivident: {
      type: "GSum",
      id: 43,
      startDirection: "left",
      gSummands: [
        {
          type: "GProduct1D",
          id: 44,
          startDirection: "left",
          gComplexFactor: {
            type: "GValue",
            id: 45,
            mValue: "5",
            numericValue: 5,
            xEdge: "top",
            yEdge: "left",
          },
          gSimpleFactor: {
            type: "GSimpleValue",
            id: 46,
            mSimpleValue: "x",
            numericValue: 2,
            edge: "top",
          },
        },
        {
          type: "GValue",
          id: 47,
          mValue: "6",
          numericValue: 6,
          xEdge: "top",
          yEdge: "left",
        },
      ],
    },
    gDivisor: {
      type: "GValue",
      id: 48,
      mValue: "4",
      numericValue: 4,
      xEdge: "top",
      yEdge: "left",
    },
    divisorEdge: "right",
    resultEdge: "bottom",
  },
  gTerm2: {
    type: "GDifference",
    id: 49,
    startDirection: "left",
    gMinuend: {
      type: "GProduct1D",
      id: 50,
      startDirection: "left",
      gComplexFactor: {
        type: "GValue",
        id: 51,
        mValue: "7",
        numericValue: 7,
        xEdge: "bottom",
        yEdge: "right",
      },
      gSimpleFactor: {
        type: "GSimpleValue",
        id: 52,
        mSimpleValue: "x",
        numericValue: 2,
        edge: "bottom",
      },
    },
    gSubtrahend: {
      type: "GValue",
      id: 53,
      mValue: "10",
      numericValue: 10,
      xEdge: "top",
      yEdge: "left",
    },
  },
};

export const Primary = Template.bind({});

Primary.args = {
  steps: 1,
  idModificationParameters: [
    [48, 'moveDivisor'],
    [61, 'distribute', { xy: 'X' }],
    [47, 'moveSummand'],
    [47, 'moveSubtrahend'],
  ],
  json: json1,
  layerTransformation: { x: 30, y: 30, scaleX: 20, scaleY: 20 }
};

export const SolveAll = Template.bind({});

SolveAll.args = {
  steps: 1,
  idModificationParameters: [
    [48, 'moveDivisor'],
    [61, 'distribute', { xy: 'X' }],
    [50, 'reverse', { xy: 'Y' }],
    [53, 'reverse', { xy: 'Y' }],
    [53, 'reverse', { xy: 'X' }],
    [43, 'swapSummands', { indexA: 0, indexB: 1 }],
    [64, 'reverse', { xy: 'Y' }],
    [44, 'moveSummand'],
    [67, 'reverse', { xy: 'X' }],
    [64, 'moveSubtrahend'],
    // [[44,50], 'swap1DAnd2D'] // TODO
    // [NaN /* ? */, 'reverseDistribute'],
    // [NaN /* ? */, 'moveDivisor'],

  ],
  json: json1,
  layerTransformation: { x: 30, y: 30, scaleX: 20, scaleY: 20 }
};

export const TryWrong = Template.bind({});

TryWrong.args = {
  steps: 1,
  idModificationParameters: [
    [48, 'moveDivisor'],
    [61, 'distribute', { xy: 'X' }],
    [44, 'moveSummand']
  ],
  json: json1,
  layerTransformation: { x: 30, y: 30, scaleX: 20, scaleY: 20 }
};

export const WithReverse = Template.bind({});

WithReverse.args = {
  steps: 1,
  idModificationParameters: [
    [48, 'moveDivisor'],
    [61, 'distribute', { xy: 'X' }],
    [43, 'reverse', { xy: 'X', isRecursive: false }],
    [44, 'moveSummand'],
    [44, 'moveSubtrahend']
  ],
  json: json1,
  layerTransformation: { x: 30, y: 30, scaleX: 20, scaleY: 20 }
};

export const WithReverseTryWrong = Template.bind({});

WithReverseTryWrong.args = {
  steps: 1,
  idModificationParameters: [
    [48, 'moveDivisor'],
    [61, 'distribute', { xy: 'X' }],
    [43, 'reverse', { xy: 'X', isRecursive: false }],
    [47, 'moveSummand'],
  ],
  json: json1,
  layerTransformation: { x: 30, y: 30, scaleX: 20, scaleY: 20 }
};
