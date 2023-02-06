import React from 'react';
import './button.css';

import GAbstractRoot from '../expression/gExpression/GAbstractRoot';
import { DrawRoot } from '../drawReact';
import { getExpressionFromJSON } from '../conversion';
import { ID } from '../types';
import { rotate } from '../modification/reconfigTerm';
import { moveSummand, moveSubtrahend, moveFactor, moveDivisor } from '../modification/modifyEquation';
import { autoAdaptTransformation, keepPositionForTransformation } from '../autoAdapt';

interface TestMoveInEquationProps {
  steps: 0 | 1 | 2 | 3
  rotations: 0 | 1 | 2 | 3,
  layerTransformation: { x: number, y: number, scaleX: number, scaleY: number }
  modification: 'moveSummand' | 'moveSubtrahend' | 'moveFactor' | 'moveDivisor',
  ids: ID[],
  json: object,
}

export const TestMoveInEquation = ({
  steps,
  modification,
  ids,
  rotations,
  json,
  layerTransformation }: TestMoveInEquationProps) => {
  const gEquation = getExpressionFromJSON(json) as GAbstractRoot;

  if(!gEquation) return <>gEquation is undefined</>

  for (let index = 0; index < rotations; index++)
    rotate(gEquation);

  gEquation.layerTransformation = layerTransformation;

  const positionForTransformation
    = keepPositionForTransformation({ gRoot: gEquation, modifiedID: ids[0] });

  for (let i = 0; i < steps; i++) {
    const id = ids[i];

    switch (modification) {
      case "moveSummand":
        moveSummand({ gEquation, id }); break;
      case "moveSubtrahend":
        moveSubtrahend({ gEquation, id }); break;
      case "moveFactor":
        moveFactor({ gEquation, id }); break;
      case "moveDivisor":
        moveDivisor({ gEquation, id }); break;
    }
  }
  autoAdaptTransformation(
    { gRoot: gEquation, modifiedID: ids[0], width: 500, height: 200, padding: 5 },
    positionForTransformation
  );

  return <>
    <DrawRoot root={gEquation} style={{ width: '100%', height: '200px' }} />
    <div style={{ whiteSpace: "pre", fontSize: "10px" }}>{`${JSON.stringify(gEquation.json, null, 2)}`}</div>
  </>
};
