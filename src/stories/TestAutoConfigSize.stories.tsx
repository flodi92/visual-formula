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
  rotations: 0,
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

export const GDifferenceExample = Template.bind({});

GDifferenceExample.args = {
  rotations: 0,
  json: {
    type: "GDifference",
    startDirection: "right",
    gMinuend: {
      type: 'GValue',
      mValue: "12",
      numericValue: 12,
      xEdge: "top",
      yEdge: "right",
    },
    gSubtrahend: {
      type: 'GValue',
      mValue: "8",
      numericValue: 8,
      xEdge: "bottom",
      yEdge: "left",
    }
  },
  layerTransformation: { x: 100, y: 100, scaleX: 20, scaleY: 20 }
};

export const GProduct1DExample = Template.bind({});

GProduct1DExample.args = {
  rotations: 0,
  json: {
    type: "GProduct1D",

    startDirection: "left",

    gComplexFactor: {
      type: "GValue",
      mValue: "2",
      numericValue: 2,
      xEdge: "top",
      yEdge: "right",
    },
    gSimpleFactor: {
      type: "GSimpleValue",
      mSimpleValue: "3",
      numericValue: 3,
      edge: "top",
    }
  },

  layerTransformation: { x: 30, y: 30, scaleX: 20, scaleY: 20 }
};

export const GProduct2DExample = Template.bind({});

GProduct2DExample.args = {
  rotations: 0,
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
    },
    gFactorY: {
      type: 'GValue',
      mValue: "4",
      numericValue: 4,
      xEdge: "bottom",
      yEdge: "left",
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
    },
    gSimpleDivisor: {
      type: "GSimpleValue",
      mSimpleValue: "3",
      numericValue: 3,
      edge: "bottom",
    }
  },
  layerTransformation: { x: 90, y: 90, scaleX: 20, scaleY: 20 }
};

export const GQuotient2DExample = Template.bind({});

GQuotient2DExample.args = {
  rotations: 0,
  json: {
    type: "GQuotient2D",
    divisorEdge: 'left',
    resultEdge: 'bottom',
    gDivident: {
      type: 'GValue',
      mValue: "10",
      numericValue: 10,
      xEdge: "bottom",
      yEdge: "right",
    },
    gDivisor: {
      type: 'GValue',
      mValue: "5",
      numericValue: 5,
      xEdge: "top",
      yEdge: "right",
    }
  },
  layerTransformation: { x: 30, y:110, scaleX: 20, scaleY: 20 }
};

export const GEQuationExample = Template.bind({});

GEQuationExample.args = {
  rotations: 0,
  json: {
    type: "GEquation",
    gTerm1: {
    type: "GQuotient2D",
    gDivident: {
      type: "GSum",
      startDirection: "left",
      gSummands: [
        {
          type: "GProduct1D",
          startDirection: "left",
          gComplexFactor: {
            type: "GValue",
            mValue: "5",
            numericValue: 5,
            xEdge: "top",
            yEdge: "left",
          },
          gSimpleFactor: {
            type: "GSimpleValue",
            mSimpleValue: "x",
            numericValue: 2,
            edge: "top",
          },
        },
        {
          type: "GValue",
          mValue: "6",
          numericValue: 6,
          xEdge: "top",
          yEdge: "left",
        },
      ],
    },
    gDivisor: {
      type: "GValue",
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
    startDirection: "left",
    gMinuend: {
      type: "GProduct1D",
      startDirection: "left",
      gComplexFactor: {
        type: "GValue",
        mValue: "7",
        numericValue: 7,
        xEdge: "bottom",
        yEdge: "right",
      },
      gSimpleFactor: {
        type: "GSimpleValue",
        mSimpleValue: "x",
        numericValue: 2,
        edge: "bottom",
      },
    },
    gSubtrahend: {
      type: "GValue",
      mValue: "10",
      numericValue: 10,
      xEdge: "top",
      yEdge: "left",
    },
  },
  },
  layerTransformation: { x: 100, y: 100, scaleX: 20, scaleY: 20 }
};