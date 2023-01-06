import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Direction, ID, XY } from '../types';
import { TestNeighbours, TestNeighboursProps } from './TestNeighbours';

export default {
  title: 'GExpression-Render/TestNeighbours',
  component: TestNeighbours,
  argTypes: {},
} as ComponentMeta<typeof TestNeighbours>;

const Template: ComponentStory<typeof TestNeighbours> = (args) => <TestNeighbours {...args} />;

const json1 = {
  id: 1,
  type: "GEquation",
  gTerm1: {
    id: 2,
    type: "GQuotient2D",
    gDivident: {
      id: 3,
      type: "GSum",
      startDirection: "left",
      gSummands: [
        {
          id: 4,
          type: "GProduct1D",
          startDirection: "left",
          gComplexFactor: {
            id: 5,
            type: "GValue",
            mValue: "5",
            numericValue: 5,
            xEdge: "top",
            yEdge: "left",
            unscaledWidth: 5 / 4,
            unscaledHeight: 4,
          },
          gSimpleFactor: {
            id: 6,
            type: "GSimpleValue",
            mSimpleValue: "x",
            numericValue: 2,
            edge: "top",
            unscaledWidth: (5 / 4) * 1,
            unscaledHeight: 4,
          },
        },
        {
          id: 7,
          type: "GValue",
          mValue: "6",
          numericValue: 6,
          xEdge: "top",
          yEdge: "left",
          unscaledWidth: 6 / 4,
          unscaledHeight: 4,
        },
      ],
    },
    gDivisor: {
      id: 8,
      type: "GValue",
      mValue: "4",
      numericValue: 4,
      xEdge: "top",
      yEdge: "left",
      unscaledWidth: 1,
      unscaledHeight: 4,
    },
    divisorEdge: "right",
    resultEdge: "bottom",
  },
  gTerm2: {
    id: 9,
    type: "GDifference",
    startDirection: "left",
    gMinuend: {
      id: 10,
      type: "GProduct1D",
      startDirection: "left",
      gComplexFactor: {
        id: 11,
        type: "GValue",
        mValue: "7",
        numericValue: 7,
        xEdge: "bottom",
        yEdge: "right",
        unscaledWidth: 7,
        unscaledHeight: 1,
      },
      gSimpleFactor: {
        id: 12,
        type: "GSimpleValue",
        mSimpleValue: "x",
        numericValue: 2,
        edge: "bottom",
        unscaledWidth: 7,
        unscaledHeight: 1,
      },
    },
    gSubtrahend: {
      id: 13,
      type: "GValue",
      mValue: "10",
      numericValue: 10,
      xEdge: "top",
      yEdge: "left",
      unscaledWidth: 10,
      unscaledHeight: 1,
    },
  },
} as object;

export const Primary = Template.bind({});

const standardConfig = (
  testedId: ID,
  operation: { type: 'getNeighbours', xy: XY }
    | { type: 'getCommonEdgeValues', direction: Direction }
) => ({
  rotations: 0,
  json: json1,
  layerTransformation: { x: 100, y: 100, scaleX: 20, scaleY: 20 },
  testedId,
  operation,
}) as TestNeighboursProps;

Primary.args = standardConfig(5, {type: "getCommonEdgeValues", direction: "right"});