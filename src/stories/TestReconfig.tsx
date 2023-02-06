import React from 'react';

import GAbstractRoot from '../expression/gExpression/GAbstractRoot';
import { DrawRoot } from '../drawReact';
import { getExpressionFromJSON } from '../conversion';
import {
  swapXToY, rotate, reverse, swap1DAnd2D, substitute,
} from '../modification/reconfigTerm';
import { autoAdaptTransformation, keepPositionForTransformation } from '../autoAdapt';

type Modification = "swapXToY" | "rotate" | "reverse" | "swap1DAnd2D" | "substitute";
interface TestReconfigProps {
  steps: 0 | 1 | 2 | 3
  rotations: 0 | 1 | 2 | 3,
  layerTransformation: { x: number, y: number, scaleX: number, scaleY: number }
  modificationID: [Modification, any][],
  json: object,
}

export const TestReconfig = ({
  steps,
  rotations,
  layerTransformation,
  modificationID,
  json,
}: TestReconfigProps) => {
  const gRoot = getExpressionFromJSON(json) as GAbstractRoot;

  if (!gRoot) return <>gEquation is undefined</>

  for (let index = 0; index < rotations; index++)
    rotate(gRoot);

  gRoot.layerTransformation = layerTransformation;

  const positionForTransformation
    = keepPositionForTransformation({ gRoot: gRoot, modifiedID: modificationID[0][1] });

  for (let i = 0; i < steps; i++) {
    const [modification, props] = modificationID[i];

    switch (modification) {
      case "swapXToY":
        swapXToY(gRoot, props); break;
      case "rotate":
        rotate(gRoot, props); break;
      case "reverse":
        reverse(gRoot, props); break;
      case "swap1DAnd2D":
        swap1DAnd2D(gRoot, props); break;
      case "substitute":
        substitute(gRoot, props); break;
    }
  }
  autoAdaptTransformation(
    { gRoot: gRoot, modifiedID: modificationID[0][1], width: 500, height: 200, padding: 5 },
    positionForTransformation
  );

  return <>
    <DrawRoot root={gRoot} style={{ width: '100%', height: '200px' }} />
    <div style={{ whiteSpace: "pre", fontSize: "10px" }}>{`${JSON.stringify(gRoot.json, null, 2)}`}</div>
  </>
};
