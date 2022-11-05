import React from 'react';
import './button.css';

import GAbstractRoot from '../expression/gExpression/GAbstractRoot';
import DrawRoot from '../draw/DrawRoot';
import { getExpressionFromJSON, getJSONFromExpression } from '../creation';
import { autoConfigSize } from '../autoAdapt/autoConfigSize';

interface TestAutoConfigSizeProps {
  json: object,
  layerTransformation: { x: number, y: number, scaleX: number, scaleY: number }
}

export const TestAutoConfigSize = ({ json, layerTransformation }: TestAutoConfigSizeProps) => {
  const expression = getExpressionFromJSON(json) as GAbstractRoot;


  autoConfigSize(expression);
  

  expression.layerTransformation = layerTransformation;

  return <>
    <DrawRoot root={expression} style={{ width: '100%', height: '200px' }} />
    <div style={{whiteSpace: "pre", fontSize: "10px"}}>{`${JSON.stringify(getJSONFromExpression(expression), null, 2)}`}</div>
  </>
};
