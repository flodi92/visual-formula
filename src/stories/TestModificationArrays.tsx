import React from 'react';
import './button.css';

import GAbstractRoot from '../expression/gExpression/GAbstractRoot';
import DrawRoot from '../draw/DrawRoot';
import { getExpressionFromJSON } from '../conversion';
import { ID } from '../types';
import { moveSummand, moveSubtrahend, moveFactor, moveDivisor } from '../modification/modifyEquation';
import { swapSummands, swapFactors1D, swapFactors2D, distribute, reverseDistribute } from '../modification/modifyTerm';
import { reverse, rotate, substitute, swap1DAnd2D, swapXToY } from '../modification/reconfigTerm';
import { autoAdaptTransformation, autoConfigSize, keepPositionForTransformation } from '../autoAdapt';
import { setUnsetIDs } from '../utils/expression';

interface TestModificationArraysProps {
  steps: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8,
  rotations: 0 | 1 | 2 | 3,
  layerTransformation: { x: number, y: number, scaleX: number, scaleY: number }
  idModificationParameters: 
    [
      ID,
      'moveSummand' | 'moveSubtrahend' | 'moveFactor' | 'moveDivisor' | 'swapSummands'
      | 'swapFactors1D' | 'swapFactors2D' | 'distribute' | 'reverseDistribute'
      | 'reverse' | 'rotate' | 'substitute' | 'swap1DAnd2D' | 'swapXToY',
      any?
    ][],
  json: object,
}

export const TestModificationArrays = ({
  steps,
  idModificationParameters,
  rotations,
  json,
  layerTransformation }: TestModificationArraysProps) => {
  const gEquation = getExpressionFromJSON(json) as GAbstractRoot;

  if (!gEquation) return <>gEquation is undefined</>

  for (let index = 0; index < rotations; index++)
    rotate(gEquation);

  gEquation.layerTransformation = layerTransformation;

  const [modifiedID] = idModificationParameters[0];

  const positionForTransformation
    = keepPositionForTransformation({ gRoot: gEquation, modifiedID });

  autoConfigSize(gEquation);

  for (let i = 0; i < steps; i++) {
    const [id, modification, parameters] = idModificationParameters[i];

    switch (modification) {
      case "moveSummand":
        moveSummand({ gEquation, id }); break;
      case "moveSubtrahend":
        moveSubtrahend({ gEquation, id }); break;
      case "moveFactor":
        moveFactor({ gEquation, id }); break;
      case "moveDivisor":
        moveDivisor({ gEquation, id }); break;
      case "swapSummands":
        swapSummands(gEquation, { id, ...parameters }); break;
      case "swapFactors1D":
        swapFactors1D(gEquation, { id, ...parameters }); break;
      case "swapFactors2D":
        swapFactors2D(gEquation, { id, ...parameters }); break;
      case "distribute":
        distribute({ id, expression: gEquation, ...parameters }); break;
      case "reverseDistribute":
        reverseDistribute({ id, expression: gEquation, ...parameters }); break;
      case "reverse":
        reverse(gEquation, { id, ...parameters }); break;
      case "rotate":
        rotate({ id, expression: gEquation, ...parameters }); break;
      case "substitute":
        substitute(gEquation, { id }); break;
      case "swap1DAnd2D":
        swap1DAnd2D(gEquation, { id }); break;
      case "swapXToY":
        swapXToY(gEquation, { id }); break;
    }
    setUnsetIDs(gEquation);
  }

  autoAdaptTransformation(
    { gRoot: gEquation, modifiedID, width: 500, height: 200, padding: 5 },
    positionForTransformation
  );

  return <>
    <DrawRoot root={gEquation} style={{ width: '100%', height: '200px' }} />
    <div style={{ whiteSpace: "pre", fontSize: "10px" }}>{`${JSON.stringify(gEquation.json, null, 2)}`}</div>
  </>
};
