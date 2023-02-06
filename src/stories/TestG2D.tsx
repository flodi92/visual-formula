import React from 'react';
import './button.css';

import GAbstractRoot from '../expression/gExpression/GAbstractRoot';
import { DrawRoot } from '../drawReact';
import { getExpressionFromJSON } from '../conversion';
import { Direction } from '../types';

interface TestG2DProps {
  json: object,
  layerTransformation: { x: number, y: number, scaleX: number, scaleY: number }
}

export const TestG2D = ({ json, layerTransformation }: TestG2DProps) => {
  const root = getExpressionFromJSON(json) as GAbstractRoot;

  root.layerTransformation = layerTransformation;

  return <DrawRoot root={root} style={{ width: '100%', height: '100%' }} />;
};
