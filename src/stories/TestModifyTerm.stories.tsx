import { ComponentStory, ComponentMeta } from '@storybook/react';
import { TestModifyTerm } from './TestModifyTerm';

export default {
  title: 'GExpression-Render/TestModifyTerm',
  component: TestModifyTerm,
  argTypes: {},
} as ComponentMeta<typeof TestModifyTerm>;

const Template: ComponentStory<typeof TestModifyTerm> = (args) => <TestModifyTerm {...args} />;

export const Primary = Template.bind({});

Primary.args = {
  modification: "swapSummands",
  doModification: true,
  modificationProps: { indexA: 0, indexB: 1 },
  id: 2,
  json: {
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
        numericValue: 6,
        xEdge: "bottom",
        yEdge: "left",

        unscaledWidth: 4,
        unscaledHeight: 2,
      },
    ],
  },

  layerTransformation: { x: 30, y: 30, scaleX: 20, scaleY: 20 }
};

export const TestSwapFactors1D = Template.bind({});

TestSwapFactors1D.args = {
  modification: "swapFactors1D",
  doModification: true,
  id: 2,
  json: {
    type: "GProduct1D",
    startDirection: "left",

    gComplexFactor: {
      type: "GValue",
      mValue: "8",
      numericValue: 8,
      xEdge: "top",
      yEdge: "right",

      unscaledWidth: 4,
      unscaledHeight: 2,
    },

    gSimpleFactor: {
      type: "GSimpleValue",
      mSimpleValue: "3",
      numericValue: 3,
      edge: "top",

      unscaledWidth: 8,
      unscaledHeight: 2,
    }
  },

  layerTransformation: { x: 30, y: 30, scaleX: 20, scaleY: 20 }
};

export const TestSwapFactors2D = Template.bind({});

TestSwapFactors2D.args = {
  modification: "swapFactors2D",
  doModification: true,
  id: 2,
  json: {
    type: "GProduct2D",
    xEdge: 'bottom',
    yEdge: 'left',
    gFactorX: {
      type: 'GValue',
      mValue: "3",
      numericValue: 3,
      xEdge: "bottom",
      yEdge: "left",

      unscaledWidth: 3,
      unscaledHeight: 1,
    },
    gFactorY: {
      type: 'GValue',
      mValue: "2",
      numericValue: 2,
      xEdge: "bottom",
      yEdge: "left",

      unscaledWidth: 1,
      unscaledHeight: 2,
    },
  },

  layerTransformation: { x: 30, y: 30, scaleX: 20, scaleY: 20 }
};

