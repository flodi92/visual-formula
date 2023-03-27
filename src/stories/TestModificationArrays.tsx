import './button.css';

import { autoAdaptEdges, autoAdaptTransformation, autoConfigSize, keepPositionForTransformation } from '../autoAdapt';
import { getExpressionFromJSON, getMExpressionFromExpression } from '../conversion';
import { DrawMValue, DrawRoot, useInteractionHandlers } from '../drawReact';
import GAbstractRoot from '../expression/gExpression/GAbstractRoot';
import Modification from '../modification/Modification';
import { rotate } from '../modification/reconfigTerm';

interface TestModificationArraysProps {
  steps: number,
  rotations: 0 | 1 | 2 | 3,
  layerTransformation: { x: number, y: number, scaleX: number, scaleY: number }
  modifications: Modification[],
  isAutoAdaptEdges: boolean,
  json: object,
}

export const TestModificationArrays = ({
  steps,
  modifications,
  rotations,
  isAutoAdaptEdges = true,
  json,
  layerTransformation }: TestModificationArraysProps) => {
  const gEquation = getExpressionFromJSON(json) as GAbstractRoot;

  if (!gEquation) return <>gEquation is undefined</>

  for (let index = 0; index < rotations; index++)
    rotate(gEquation);

  gEquation.layerTransformation = layerTransformation;

  const modifiedID = !!modifications?.length ? modifications[0]?.id : undefined;

  const positionForTransformation
    = keepPositionForTransformation({ gRoot: gEquation, modifiedID });

  autoConfigSize(gEquation);

  if (isAutoAdaptEdges) autoAdaptEdges(gEquation)

  if (steps > modifications.length || steps < 0) return <h1>Overflow!!</h1>


  const modification = modifications[steps - 1];
  modifications = modifications.slice(0, steps);

  autoAdaptTransformation(
    { gRoot: gEquation, modifiedID, width: 500, height: 200, padding: 5 },
    positionForTransformation
  );

  const { root, ...interactionProps } = useInteractionHandlers(gEquation, modifications);

  if (!root) return <></>;

  return <>
    <div style={{ fontStyle: "italic", fontSize: "13px" }}>Id: {interactionProps.selectedIDs?.join(" ")}<br />{JSON.stringify(modification)}</div>
    <DrawRoot {...{ root, ...interactionProps }} style={{ width: '600px', height: '200px' }} />
    <DrawMValue mExpression={getMExpressionFromExpression(root)}{...interactionProps} />
    <div style={{ whiteSpace: "pre", fontSize: "10px" }}>{`${JSON.stringify(root.json, null, 2)}`}</div>
  </>
};
