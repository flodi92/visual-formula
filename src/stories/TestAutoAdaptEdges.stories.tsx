import { ComponentStory, ComponentMeta } from '@storybook/react';
import { TestAutoAdaptEdges } from './TestAutoAdaptEdges';
// import { TestAutoAdaptEdges } from './TestAutoAdaptEdges';

export default {
  title: 'GExpression-Render/TestAutoAdaptEdges',
  component: TestAutoAdaptEdges,
  argTypes: {},
} as ComponentMeta<typeof TestAutoAdaptEdges>;

const Template: ComponentStory<typeof TestAutoAdaptEdges> = (args) => <TestAutoAdaptEdges {...args} />;

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
      },
      {
        type: 'GValue',
        mValue: "12",
        numericValue: 12,
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
    },
    gSubtrahend: {
      type: 'GValue',
      mValue: "8",
      numericValue: 8,
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
    },
    gSimpleFactor: {
      type: "GSimpleValue",
      mSimpleValue: "3",
      numericValue: 3,
    }
  },

  layerTransformation: { x: 30, y: 30, scaleX: 20, scaleY: 20 }
};

export const GProduct2DExample = Template.bind({});

GProduct2DExample.args = {
  rotations: 0,
  json: {
    type: "GProduct2D",
    gFactorX: {
      type: 'GValue',
      mValue: "6",
      numericValue: 6,
    },
    gFactorY: {
      type: 'GValue',
      mValue: "4",
      numericValue: 4,
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
    },
    gSimpleDivisor: {
      type: "GSimpleValue",
      mSimpleValue: "3",
      numericValue: 3,
    }
  },
  layerTransformation: { x: 90, y: 90, scaleX: 20, scaleY: 20 }
};

// export const GQuotient2DExample = Template.bind({});

// GQuotient2DExample.args = {
//   rotations: 0,
//   json: {
//     type: "GQuotient2D",
//     gDivident: {
//       type: 'GValue',
//       mValue: "10",
//       numericValue: 10,
//     },
//     gDivisor: {
//       type: 'GValue',
//       mValue: "5",
//       numericValue: 5,
//     }
//   },
//   layerTransformation: { x: 30, y:110, scaleX: 20, scaleY: 20 }
// };

// export const GEQuationExample = Template.bind({});

// GEQuationExample.args = {
//   rotations: 0,
//   json: {
//     type: "GEquation",
//     gTerm1: {
//     type: "GQuotient2D",
//     gDivident: {
//       type: "GSum",
//       startDirection: "left",
//       gSummands: [
//         {
//           type: "GProduct1D",
//           startDirection: "left",
//           gComplexFactor: {
//             type: "GValue",
//             mValue: "5",
//             numericValue: 5,
//           },
//           gSimpleFactor: {
//             type: "GSimpleValue",
//             mSimpleValue: "x",
//             numericValue: 2,
//           },
//         },
//         {
//           type: "GValue",
//           mValue: "6",
//           numericValue: 6,
//         },
//       ],
//     },
//     gDivisor: {
//       type: "GValue",
//       mValue: "4",
//       numericValue: 4,
//     },
//   },
//     gTerm2: {
//     type: "GDifference",
//     startDirection: "left",
//     gMinuend: {
//       type: "GProduct1D",
//       startDirection: "left",
//       gComplexFactor: {
//         type: "GValue",
//         mValue: "7",
//         numericValue: 7,
//       },
//       gSimpleFactor: {
//         type: "GSimpleValue",
//         mSimpleValue: "x",
//         numericValue: 2,
//       },
//     },
//     gSubtrahend: {
//       type: "GValue",
//       mValue: "10",
//       numericValue: 10,
//     },
//   },
//   },
//   layerTransformation: { x: 100, y: 100, scaleX: 20, scaleY: 20 }
// };