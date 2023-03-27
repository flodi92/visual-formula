import { ComponentStory, ComponentMeta } from '@storybook/react';
import { MoveDivisor, MoveFactor, MoveSubtrahend, MoveSummand } from '../modification/modifyEquation';
import { Distribute, ReverseDistribute, SwapSummands } from '../modification/modifyTerm';
import { Reverse, Substitute, MultiSubstitute,  Swap1DAnd2D } from '../modification/reconfigTerm';
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
  steps: 0,
  modifications: [
    { type: 'moveDivisor', id: 48 } as MoveDivisor,
    { type: 'distribute', id: 57, xy: 'X' } as Distribute,
    { type: 'moveSummand', id: 47 } as MoveSummand,
    { type: 'moveSubtrahend', id: 47 } as MoveSubtrahend,
  ],
  json: json1,
};


export const SolveAll = Template.bind({});

SolveAll.args = {
  steps: 0,
  modifications: [
    { type: 'moveDivisor', id: 48, } as MoveDivisor,
    { type: 'distribute', id: 57, xy: 'X' } as Distribute,
    { type: 'swapSummands', id: 43, indexA: 0, indexB: 1 } as SwapSummands,
    { type: 'moveSummand', id: 44, } as MoveSummand,
    { type: 'reverse', id: 69, xy: 'X' } as Reverse,
    { type: 'moveSubtrahend', id: 62, } as MoveSubtrahend,
    { type: 'substitute', id: 65 } as Substitute,
    { type: 'reverse', id: 50, xy: 'X' } as Reverse,
    { type: 'substitute', ids: [60, 51], } as MultiSubstitute,
    { type: 'swap1DAnd2D', ids: [44, 57], } as Swap1DAnd2D,
    { type: 'reverseDistribute', id: 49, xy: 'X' } as ReverseDistribute,
    { type: 'moveFactor', id: 72, } as MoveFactor,
  ],
  json: json1,
};

// TODO ids might be wrong

// export const TryWrong = Template.bind({});

// TryWrong.args = {
//   steps: 1,
//   idModificationParameters: [
//     [48, 'moveDivisor'],
//     [61, 'distribute', { xy: 'X' }],
//     [44, 'moveSummand']
//   ],
//   json: json1,
//   layerTransformation: { x: 30, y: 30, scaleX: 20, scaleY: 20 }
// };

// export const WithReverse = Template.bind({});

// WithReverse.args = {
//   steps: 1,
//   idModificationParameters: [
//     [48, 'moveDivisor'],
//     [61, 'distribute', { xy: 'X' }],
//     [43, 'reverse', { xy: 'X', isRecursive: false }],
//     [44, 'moveSummand'],
//     [44, 'moveSubtrahend']
//   ],
//   json: json1,
//   layerTransformation: { x: 30, y: 30, scaleX: 20, scaleY: 20 }
// };

// export const WithReverseTryWrong = Template.bind({});

// WithReverseTryWrong.args = {
//   steps: 1,
//   idModificationParameters: [
//     [48, 'moveDivisor'],
//     [61, 'distribute', { xy: 'X' }],
//     [43, 'reverse', { xy: 'X', isRecursive: false }],
//     [47, 'moveSummand'],
//   ],
//   json: json1,
//   layerTransformation: { x: 30, y: 30, scaleX: 20, scaleY: 20 }
// };
