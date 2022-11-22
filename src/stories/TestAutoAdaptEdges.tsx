import React from 'react';
import './button.css';

import GAbstractRoot from '../expression/gExpression/GAbstractRoot';
import DrawRoot from '../draw/DrawRoot';
import { getExpressionFromJSON } from '../conversion';
import { autoAdaptEdges, autoConfigSize } from '../autoAdapt';
import { rotate } from '../modification/reconfigTerm';

interface TestAutoAdaptEdgesProps {
  rotations: 0 | 1 | 2 | 3,
  json: object,
  layerTransformation: { x: number, y: number, scaleX: number, scaleY: number }
}

export const TestAutoAdaptEdges = ({ rotations, json, layerTransformation }: TestAutoAdaptEdgesProps) => {
  const expression = getExpressionFromJSON(json) as GAbstractRoot;

  for (let index = 0; index < rotations; index++)
    rotate(expression);

  autoConfigSize(expression);
  autoAdaptEdges(expression)

  expression.layerTransformation = layerTransformation;

  return <>
    <DrawRoot root={expression} style={{ width: '100%', height: '200px' }} />
    <div style={{ whiteSpace: "pre", fontSize: "10px" }}>{`${JSON.stringify(expression.json, null, 2)}`}</div>
  </>
};
