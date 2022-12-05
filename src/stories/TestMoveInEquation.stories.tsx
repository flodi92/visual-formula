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
  steps: 1,
  modification: 'moveSummand',
  ids: [42, 43, 44],
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
  },

  layerTransformation: { x: 30, y: 30, scaleX: 20, scaleY: 20 }
};

export const Difference = Template.bind({});

Difference.args = {
  steps: 1,
  modification: 'moveSubtrahend',
  ids: [42],
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

export const Product2D = Template.bind({});

Product2D.args = {
  steps: 1,
  modification: 'moveFactor',
  ids: [42],
  json: {
    type: "GEquation",
    gTerm1: {
      type: "GProduct2D",
      xEdge: 'bottom',
      yEdge: 'left',
      gFactorX: {
        type: 'GValue',
        mValue: "6",
        numericValue: 6,
        xEdge: "top",
        yEdge: "left",

        unscaledWidth: 3,
        unscaledHeight: 1,
        id: 42,
      },
      gFactorY: {
        type: 'GValue',
        mValue: "4",
        numericValue: 4,
        xEdge: "bottom",
        yEdge: "right",

        unscaledWidth: 1,
        unscaledHeight: 2,
      }
    },
    gTerm2: {
      type: "GValue",
      mValue: "6",
      xEdge: "top",
      yEdge: "right",
      unscaledWidth: 3,
      unscaledHeight: 2,
      numericValue: 6,
    },
  },

  layerTransformation: { x: 30, y: 30, scaleX: 20, scaleY: 20 }
};

export const Quotient2D = Template.bind({});

Quotient2D.args = {
  steps: 1,
  modification: 'moveDivisor',
  ids: [42],
  layerTransformation: { x: 30, y: 30, scaleX: 20, scaleY: 20 },

  json: {
    type: "GEquation",
    gTerm1: {
      type: "GValue",
      mValue: "4",
      xEdge: "bottom",
      yEdge: "right",
      unscaledWidth: 1,
      unscaledHeight: 2,
      numericValue: 4,
    },
    gTerm2: {
      type: "GQuotient2D",
      gDivident: {
        type: "GValue",
        mValue: "6",
        xEdge: "top",
        yEdge: "right",
        unscaledWidth: 3,
        unscaledHeight: 2,
        numericValue: 6,
      },
      gDivisor: {
        type: "GValue",
        mValue: "6",
        xEdge: "top",
        yEdge: "left",
        unscaledWidth: 3,
        unscaledHeight: 1,
        numericValue: 6,
        id: 42
      },
      divisorEdge: "bottom",
      resultEdge: "left"
    },
  }
}

export const Product1DMoveComplex = Template.bind({});

const product1dJSON = {
  type: "GEquation",
  gTerm1: {
    type: "GProduct1D",

    startDirection: "left",

    gComplexFactor: {
      type: "GValue",
      mValue: "4",
      numericValue: 4,
      xEdge: "top",
      yEdge: "right",

      unscaledWidth: 2,
      unscaledHeight: 2,
      id: 42,
    },
    gSimpleFactor: {
      type: "GSimpleValue",
      mSimpleValue: "4",
      numericValue: 4,
      edge: "top",

      unscaledWidth: 6,
      unscaledHeight: 2,
      id: 43,
    }
  },
  gTerm2: {
    type: "GValue",
    mValue: "16",
    numericValue: 16,
    xEdge: "bottom",
    yEdge: "right",

    unscaledWidth: 8,
    unscaledHeight: 2,
    id: 44,
  },
};

Product1DMoveComplex.args = {
  steps: 1,
  modification: 'moveFactor',
  ids: [42],
  json: product1dJSON,

  layerTransformation: { x: 30, y: 30, scaleX: 20, scaleY: 20 }
};

export const Product1DMoveSimple = Template.bind({});

Product1DMoveSimple.args = {
  steps: 1,
  modification: 'moveFactor',
  ids: [43],
  json: product1dJSON,

  layerTransformation: { x: 30, y: 30, scaleX: 20, scaleY: 20 }
};

export const Quotient1D = Template.bind({});

Quotient1D.args = {
  steps: 1,
  modification: 'moveDivisor',
  ids: [42],
  layerTransformation: { x: 30, y: 30, scaleX: 20, scaleY: 20 },

  json: {
    type: "GEquation",
    gTerm1: {
      type: "GValue",
      mValue: "4",
      xEdge: "top",
      yEdge: "right",
      unscaledWidth: 2,
      unscaledHeight: 2,
      numericValue: 4,
    },
    gTerm2: {
      type: "GQuotient1D",
      gSimpleDivisor: {
        type: "GSimpleValue",
        mSimpleValue: "4",
        edge: "top",
        unscaledWidth: 6,
        unscaledHeight: 2,
        numericValue: 4,
        id: 42
      },
      gComplexDivident: {
        type: "GValue",
        mValue: "16",
        xEdge: "bottom",
        yEdge: "right",
        unscaledWidth: 8,
        unscaledHeight: 2,
        numericValue: 16,
      },
      startDirection: "right"
    },
  }
}