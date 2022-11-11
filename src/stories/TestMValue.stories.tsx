import { ComponentStory, ComponentMeta } from '@storybook/react';
import { TestMValue } from './TestMValue';

export default {
  title: 'GExpression-Render/TestMValue',
  component: TestMValue,
  argTypes: {},
} as ComponentMeta<typeof TestMValue>;

const Template: ComponentStory<typeof TestMValue> = (args) => <TestMValue {...args} />;

export const Primary = Template.bind({});

Primary.args = {
  json:  {
    type: 'GValue',
    mValue: "2",
    numericValue: 1,
    xEdge: "bottom",
    yEdge: "left",

    unscaledWidth: 4,
    unscaledHeight: 2,
  },

  layerTransformation: { x: 30, y: 30, scaleX: 20, scaleY: 20 }
};

export const Sum = Template.bind({});

Sum.args = {
  json:  {
    type: 'GValue',
    mValue: "2+x",
    numericValue: 1,
    xEdge: "bottom",
    yEdge: "left",

    unscaledWidth: 4,
    unscaledHeight: 2,
  },

  layerTransformation: { x: 30, y: 30, scaleX: 20, scaleY: 20 }
};

export const Difference = Template.bind({});

Difference.args = {
  json:  {
    type: 'GValue',
    mValue: "2-x",
    numericValue: 1,
    xEdge: "bottom",
    yEdge: "left",

    unscaledWidth: 4,
    unscaledHeight: 2,
  },

  layerTransformation: { x: 30, y: 30, scaleX: 20, scaleY: 20 }
};

export const Product = Template.bind({});

Product.args = {
  json:  {
    type: 'GValue',
    mValue: "2*x",
    numericValue: 1,
    xEdge: "bottom",
    yEdge: "left",

    unscaledWidth: 4,
    unscaledHeight: 2,
  },

  layerTransformation: { x: 30, y: 30, scaleX: 20, scaleY: 20 }
};

export const Quotient = Template.bind({});

Quotient.args = {
  json:  {
    type: 'GValue',
    mValue: "2/x",
    numericValue: 1,
    xEdge: "bottom",
    yEdge: "left",

    unscaledWidth: 4,
    unscaledHeight: 2,
  },

  layerTransformation: { x: 30, y: 30, scaleX: 20, scaleY: 20 }
};

export const SumTimesProduct = Template.bind({});

SumTimesProduct.args = {
  json:  {
    type: 'GValue',
    mValue: "(2+x)*3",
    numericValue: 1,
    xEdge: "bottom",
    yEdge: "left",

    unscaledWidth: 4,
    unscaledHeight: 2,
  },

  layerTransformation: { x: 30, y: 30, scaleX: 20, scaleY: 20 }
};

export const ProductPlusSummand = Template.bind({});

ProductPlusSummand.args = {
  json:  {
    type: 'GValue',
    mValue: "(2*x)+3",
    numericValue: 1,
    xEdge: "bottom",
    yEdge: "left",

    unscaledWidth: 4,
    unscaledHeight: 2,
  },

  layerTransformation: { x: 30, y: 30, scaleX: 20, scaleY: 20 }
};

export const SumTimesQuotient = Template.bind({});

SumTimesQuotient.args = {
  json:  {
    type: 'GValue',
    mValue: "(2+x)/3",
    numericValue: 1,
    xEdge: "bottom",
    yEdge: "left",

    unscaledWidth: 4,
    unscaledHeight: 2,
  },

  layerTransformation: { x: 30, y: 30, scaleX: 20, scaleY: 20 }
};

export const QuotientPlusSummand = Template.bind({});

QuotientPlusSummand.args = {
  json:  {
    type: 'GValue',
    mValue: "(2/x)+3",
    numericValue: 1,
    xEdge: "bottom",
    yEdge: "left",

    unscaledWidth: 4,
    unscaledHeight: 2,
  },

  layerTransformation: { x: 30, y: 30, scaleX: 20, scaleY: 20 }
};
