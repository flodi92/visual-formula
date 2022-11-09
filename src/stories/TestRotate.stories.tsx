import { ComponentStory, ComponentMeta } from '@storybook/react';
import { TestRotate } from './TestRotate';

export default {
  title: 'GExpression-Render/TestRotate',
  component: TestRotate,
  argTypes: {},
} as ComponentMeta<typeof TestRotate>;

const Template: ComponentStory<typeof TestRotate> = (args) => <TestRotate {...args} />;

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

      unscaledWidth: 6,
      unscaledHeight: 2,
    },
    gSubtrahend: {
      type: 'GValue',
      mValue: "2",
      numericValue: 1,
      xEdge: "bottom",
      yEdge: "left",

      unscaledWidth: 4,
      unscaledHeight: 2,
    }
  },

  layerTransformation: { x: 130, y: 30, scaleX: 20, scaleY: 20 }
};



export const GProduct1DExample = Template.bind({});

GProduct1DExample.args = {
  json: {
    type: "GProduct1D",

    startDirection: "left",

    gComplexFactor: {
      type: "GValue",
      mValue: "2",
      numericValue: 1,
      xEdge: "top",
      yEdge: "right",

      unscaledWidth: 4,
      unscaledHeight: 2,
    },
    gSimpleFactor: {
      type: "GSimpleValue",
      mSimpleValue: "2",
      numericValue: 1,
      edge: "top",

      unscaledWidth: 6,
      unscaledHeight: 2,
    }

  },

  layerTransformation: { x: 30, y: 30, scaleX: 20, scaleY: 20 }
};

export const GProduct2DExample = Template.bind({});

GProduct2DExample.args = {
  json: {
    type: "GProduct2D",
    xEdge: 'bottom',
    yEdge: 'left',
    gFactorX: {
      type: 'GValue',
      mValue: "6",
      numericValue: 6,
      xEdge: "bottom",
      yEdge: "left",

      unscaledWidth: 3,
      unscaledHeight: 1,
    },
    gFactorY: {
      type: 'GValue',
      mValue: "4",
      numericValue: 4,
      xEdge: "bottom",
      yEdge: "left",

      unscaledWidth: 1,
      unscaledHeight: 2,
    },
  },
  
  layerTransformation: { x: 30, y: 30, scaleX: 20, scaleY: 20 }
};

export const GQuotient1DExample = Template.bind({});

GQuotient1DExample.args = {
  rotations: 0,
  json: {
    type: "GQuotient1D",

    startDirection: "left",

    gComplexDivident: {
      type: "GValue",
      mValue: "12",
      numericValue: 12,
      xEdge: "top",
      yEdge: "right",

      unscaledWidth: 6,
      unscaledHeight: 2,
    },
    gSimpleDivisor: {
      type: "GSimpleValue",
      mSimpleValue: "3",
      numericValue: 3,
      edge: "bottom",

      unscaledWidth: 4,
      unscaledHeight: 2
    }
  },
  layerTransformation: { x: 100, y: 100, scaleX: 20, scaleY: 20 }
};

export const GQuotient2DExample = Template.bind({});

GQuotient2DExample.args = {
  json: {
    type: "GQuotient2D",
    divisorEdge: 'left',
    resultEdge: 'bottom',
    gDivident: {
      type: 'GValue',
      mValue: "2",
      numericValue: 1,
      xEdge: "bottom",
      yEdge: "right",

      unscaledWidth: 6,
      unscaledHeight: 5,
    },
    gDivisor: {
      type: 'GValue',
      mValue: "2",
      numericValue: 1,
      xEdge: "top",
      yEdge: "right",

      unscaledWidth: 1,
      unscaledHeight: 5,
    }
  },

  layerTransformation: { x: 120, y: 80, scaleX: 10, scaleY: 10 }
};

