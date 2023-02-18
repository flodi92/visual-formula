import React from 'react';
import PropTypes from 'prop-types';
import './button.css';

import GAbstractRoot from '../expression/gExpression/GAbstractRoot';
import { DrawMValue, DrawRoot } from '../drawReact';
import { getExpressionFromJSON, getMExpressionFromExpression } from '../conversion';
import { ID } from '../types';
import { moveSummand, moveSubtrahend, moveFactor, moveDivisor } from '../modification/modifyEquation';
import { swapSummands, swapFactors1D, swapFactors2D, distribute, reverseDistribute } from '../modification/modifyTerm';
import { reverse, rotate, substitute, swap1DAnd2D, swapXToY } from '../modification/reconfigTerm';
import { autoAdaptEdges, autoAdaptTransformation, autoConfigSize, keepPositionForTransformation } from '../autoAdapt';
import { setUnsetIDs } from '../utils/expression';

interface TestModificationArraysProps {
  steps: number,
  rotations: 0 | 1 | 2 | 3,
  layerTransformation: { x: number, y: number, scaleX: number, scaleY: number }
  idModificationParameters:
  [
    ID | [ID, ID],
    'moveSummand' | 'moveSubtrahend' | 'moveFactor' | 'moveDivisor' | 'swapSummands'
    | 'swapFactors1D' | 'swapFactors2D' | 'distribute' | 'reverseDistribute'
    | 'reverse' | 'rotate' | 'substitute' | 'swap1DAnd2D' | 'swapXToY',
    any?
  ][],
  isAutoAdaptEdges: boolean,
  json: object,
}

export const TestModificationArrays = ({
  steps,
  idModificationParameters,
  rotations,
  isAutoAdaptEdges = true,
  json,
  layerTransformation }: TestModificationArraysProps) => {
  const gEquation = getExpressionFromJSON(json) as GAbstractRoot;

  if (!gEquation) return <>gEquation is undefined</>

  for (let index = 0; index < rotations; index++)
    rotate(gEquation);

  gEquation.layerTransformation = layerTransformation;

  const [_modifiedID] = idModificationParameters[0];
  const modifiedID = Array.isArray(_modifiedID) ? _modifiedID[0] : _modifiedID;

  const positionForTransformation
    = keepPositionForTransformation({ gRoot: gEquation, modifiedID });

  autoConfigSize(gEquation);

  if (isAutoAdaptEdges) autoAdaptEdges(gEquation)

  if (steps > idModificationParameters.length) return <h1>Overflow!!</h1>

  for (let i = 0; i < steps; i++) {
    const [idOrIds, modification, parameters] = idModificationParameters[i];

    const [id, ids] = Array.isArray(idOrIds) ? [undefined, idOrIds] : [idOrIds, undefined]
    if (id !== undefined) {
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
    } else if (ids !== undefined) {
      switch (modification) {
        case "swap1DAnd2D":
          swap1DAnd2D(gEquation, { ids });
          autoConfigSize(gEquation);
          break;
        case "substitute":
          substitute(gEquation, { ids });
          break;
      }
    }


    setUnsetIDs(gEquation);
  }

  autoAdaptTransformation(
    { gRoot: gEquation, modifiedID, width: 500, height: 200, padding: 5 },
    positionForTransformation
  );

  const [id, modification, parameters] = steps > 0 ? idModificationParameters[steps - 1] : [];
  return <>
    <div style={{ fontStyle: "italic", fontSize: "13px" }}>{JSON.stringify({ id, modification, parameters })}</div>
    <DrawRoot root={gEquation} style={{ width: '600px', height: '200px' }} />
    <DrawMValue mExpression={getMExpressionFromExpression(gEquation)}></DrawMValue>
    <div style={{ whiteSpace: "pre", fontSize: "10px" }}>{`${JSON.stringify(gEquation.json, null, 2)}`}</div>
  </>
};
