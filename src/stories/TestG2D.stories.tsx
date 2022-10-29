import { ComponentStory, ComponentMeta } from '@storybook/react';
import { TestG2D } from './TestG2D';

export default {
  title: 'GExpression-Render/TestG2D',
  component: TestG2D,
  argTypes: {},
} as ComponentMeta<typeof TestG2D>;

const Template: ComponentStory<typeof TestG2D> = (args) => <TestG2D {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  json: {
    type: "GProduct2D",
    xEdge: 'bottom',
    yEdge: 'left',
    gFactorX: {
      type: 'GValue',
      mValue: "6",
      numbericValue: 6,
      xEdge: "bottom",
      yEdge: "left",

      unscaledWidth: 3,
      unscaledHeight: 1,
    },
    gFactorY: {
      type: 'GValue',
      mValue: "4",
      numbericValue: 4,
      xEdge: "bottom",
      yEdge: "left",

      unscaledWidth: 1,
      unscaledHeight: 2,
    }
  },

  layerTransformation: { x: 30, y: 30, scaleX: 20, scaleY: 20 }
};

export const GQuotient2DExample = Template.bind({});

GQuotient2DExample.args = {
  json: {
    type: "GQuotient2D",
    divisorEdge: 'bottom',
    resultEdge: 'left',
    gDivident: {
      type: 'GValue',
      mValue: "2",
      numbericValue: 1,
      xEdge: "top",
      yEdge: "right",

      unscaledWidth: 6,
      unscaledHeight: 5,
    },
    gDivisor: {
      type: 'GValue',
      mValue: "2",
      numbericValue: 1,
      xEdge: "bottom",
      yEdge: "left",

      unscaledWidth: 6,
      unscaledHeight: 1,
    }
  },

  layerTransformation: { x: 30, y: 30, scaleX: 20, scaleY: 20 }
};

