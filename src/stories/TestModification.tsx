import React from 'react';
import './button.css';

import GAbstractRoot from '../expression/gExpression/GAbstractRoot';
import DrawRoot from '../draw/DrawRoot';
import { getExpressionFromJSON } from '../conversion';
import { reverse } from '../modification/reconfigTerm';
import { XY } from '../types';

interface TestModificationProps {
  xy: XY | undefined
  json: object,
  layerTransformation: { x: number, y: number, scaleX: number, scaleY: number }
}

export const TestModification = ({ xy, json, layerTransformation }: TestModificationProps) => {
  const expression = getExpressionFromJSON(json) as GAbstractRoot;

  reverse({ expression, xy });

  expression.layerTransformation = layerTransformation;

  return <DrawRoot root={expression} style={{ width: '100%', height: '100%' }} />;
};
