import React from 'react';
import './button.css';

import GAbstractRoot from '../expression/gExpression/GAbstractRoot';
import DrawRoot from '../draw/DrawRoot';
import { getExpressionFromJSON } from '../conversion';
import { ID } from '../types';
import { rotate } from '../modification/reconfigTerm';
import { moveSummand } from '../modification/modifyEquation';
import { autoAdaptTransformation } from '../autoAdapt';

interface TestMoveInEquationProps {
  doModification: boolean,
  id: ID,
  rotations: 0 | 1 | 2 | 3,
  json: object,
  layerTransformation: { x: number, y: number, scaleX: number, scaleY: number }
}

export const TestMoveInEquation = ({
  doModification,
  id,
  rotations,
  json,
  layerTransformation }: TestMoveInEquationProps) => {
  const gEquation = getExpressionFromJSON(json) as GAbstractRoot;

  for (let index = 0; index < rotations; index++)
    rotate(gEquation);

  gEquation.layerTransformation = layerTransformation;

  if (doModification) {
    moveSummand({ gEquation, id })
  }

  autoAdaptTransformation(
    { gRoot: gEquation, width: 500, height: 200, padding: 5 },
  );

  return <>
    <DrawRoot root={gEquation} style={{ width: '100%', height: '200px' }} />
    <div style={{ whiteSpace: "pre", fontSize: "10px" }}>{`${JSON.stringify(gEquation.json, null, 2)}`}</div>
  </>
};
