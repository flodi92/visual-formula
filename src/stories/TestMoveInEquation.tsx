import React from 'react';
import './button.css';

import GAbstractRoot from '../expression/gExpression/GAbstractRoot';
import DrawRoot from '../draw/DrawRoot';
import { getExpressionFromJSON } from '../conversion';
import { ID } from '../types';
import { rotate } from '../modification/reconfigTerm';
import { moveSummand, moveSubtrahend, moveFactor, moveDivisor } from '../modification/modifyEquation';
import { autoAdaptTransformation, keepPositionForTransformation } from '../autoAdapt';

interface TestMoveInEquationProps {
  doModification: boolean,
  modification: 'moveSummand' | 'moveSubtrahend' | 'moveFactor' | 'moveDivisor',
  id: ID,
  rotations: 0 | 1 | 2 | 3,
  json: object,
  layerTransformation: { x: number, y: number, scaleX: number, scaleY: number }
}

export const TestMoveInEquation = ({
  doModification,
  modification,
  id,
  rotations,
  json,
  layerTransformation }: TestMoveInEquationProps) => {
  const gEquation = getExpressionFromJSON(json) as GAbstractRoot;

  for (let index = 0; index < rotations; index++)
    rotate(gEquation);

  gEquation.layerTransformation = layerTransformation;

  const positionForTransformation
    = keepPositionForTransformation({ gRoot: gEquation, modifiedID: id });
  if (doModification) {

    switch (modification) {
      case "moveSummand":
        moveSummand({ gEquation, id }); break;
      case "moveSubtrahend":
        moveSubtrahend({ gEquation, id }); break;
      case "moveFactor":
        console.log(id);
        moveFactor({ gEquation, id }); break;
      case "moveDivisor":
        moveDivisor({ gEquation, id }); break;
    }
  }
  autoAdaptTransformation(
    { gRoot: gEquation, modifiedID: id, width: 500, height: 200, padding: 5 },
    positionForTransformation
  );

  return <>
    <DrawRoot root={gEquation} style={{ width: '100%', height: '200px' }} />
    <div style={{ whiteSpace: "pre", fontSize: "10px" }}>{`${JSON.stringify(gEquation.json, null, 2)}`}</div>
  </>
};
