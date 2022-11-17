import React from 'react';
import './button.css';

import GAbstractRoot from '../expression/gExpression/GAbstractRoot';
import DrawRoot from '../draw/DrawRoot';
import { getExpressionFromJSON } from '../conversion';
import { XDirection, YDirection } from '../types';

interface TestGValueProps {
  xEdge: YDirection;
  yEdge: XDirection;

  unscaledWidth: number;
  unscaledHeight: number;

  x: number;
  y: number;
  scaleX: number;
  scaleY: number;
}

export const TestGValue = ({ x, y, scaleX, scaleY, ...props }: TestGValueProps) => {
  const root = getExpressionFromJSON({
    type: 'GValue',
    mValue: '1',
    numericValue: 2,
    ...props,
  }) as GAbstractRoot;

  root.layerTransformation = { x, y, scaleX, scaleY }

  return <DrawRoot root={root} style={{ width: '100%', height: '100%' }} />;
};
