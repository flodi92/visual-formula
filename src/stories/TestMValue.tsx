import React from 'react';
import './button.css';

import GAbstractRoot from '../expression/gExpression/GAbstractRoot';
import DrawRoot from '../draw/DrawRoot';
import { getExpressionFromJSON, getJSONFromExpression } from '../conversion';

interface TestMValueProps {
  json: object,
  layerTransformation: { x: number, y: number, scaleX: number, scaleY: number }
}

export const TestMValue = ({ json, layerTransformation }: TestMValueProps) => {
  const expression = getExpressionFromJSON(json) as GAbstractRoot;

  expression.layerTransformation = layerTransformation;

  return <>
    <DrawRoot root={expression} style={{ width: '100%', height: '200px' }} />
    <div style={{whiteSpace: "pre", fontSize: "10px"}}>{`${JSON.stringify(getJSONFromExpression(expression), null, 2)}`}</div>
  </>
};
