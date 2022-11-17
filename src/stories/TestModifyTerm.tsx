import React from 'react';
import './button.css';

import GAbstractRoot from '../expression/gExpression/GAbstractRoot';
import DrawRoot from '../draw/DrawRoot';
import { getExpressionFromJSON, getJSONFromExpression } from '../conversion';
import { swapSummands, swapFactors1D, swapFactors2D } from '../modification/modifyTerm';
import { ID } from '../types';
import { rotate } from '../modification/reconfigTerm';

interface TestModifyTermProps {
  modification: 'swapSummands' | 'swapFactors1D' | 'swapFactors2D' | 'distribute' | 'reverseDistribute',
  doModification: boolean,
  modificationProps: any,
  id: ID,
  rotations: 0 | 1 | 2 | 3,
  json: object,
  layerTransformation: { x: number, y: number, scaleX: number, scaleY: number }
}

export const TestModifyTerm = ({
  modification,
  doModification,
  modificationProps,
  id,
  rotations,
  json,
  layerTransformation }: TestModifyTermProps) => {
  const expression = getExpressionFromJSON(json) as GAbstractRoot;

  for (let index = 0; index < rotations; index++)
    rotate({ expression });
  if (doModification) {
    switch (modification) {
      case 'swapSummands': swapSummands({ expression, id, ...modificationProps }); break;
      case 'swapFactors1D': swapFactors1D({ expression, id }); break;
      case 'swapFactors2D': swapFactors2D({ expression, id }); break;
      // case 'distribute': distribute({ expression, id, xy }); break;
      // case 'reverseDistribute': reverseDistribute({ expression, id, xy }); break;
    }
  }

  expression.layerTransformation = layerTransformation;

  return <>
    <DrawRoot root={expression} style={{ width: '100%', height: '200px' }} />
    <div style={{ whiteSpace: "pre", fontSize: "10px" }}>{`${JSON.stringify(getJSONFromExpression(expression), null, 2)}`}</div>
  </>
};
