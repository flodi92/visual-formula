import './button.css';

import { getMExpressionFromExpression } from '../conversion';
import { DrawMValue, DrawRoot, useInteractionHandlers } from '../drawReact';
import Modification from '../modification/Modification';

interface TestModificationArraysProps {
  steps: number,
  scale: number,
  modifications: Modification[],
  json: object,
}

export const TestModificationArrays = ({
  steps = 0,
  scale = 20,
  modifications,
  json }: TestModificationArraysProps) => {

  if (steps > modifications.length || steps < 0) return <h1>Overflow!!</h1>


  const modification = modifications[steps - 1];
  modifications = modifications.slice(0, steps);


  const { root, ...interactionProps } = useInteractionHandlers(json, scale, modifications);

  if (!root) return <></>;

  return <>
    <div style={{ fontStyle: "italic", fontSize: "13px" }}>Id: {interactionProps.selectedIDs?.join(" ")}<br />{JSON.stringify(modification)}</div>
    <DrawRoot {...{ root, ...interactionProps }} style={{ width: '600px', height: '200px' }} />
    <DrawMValue mExpression={getMExpressionFromExpression(root)}{...interactionProps} />
    <div style={{ whiteSpace: "pre", fontSize: "10px" }}>{`${JSON.stringify(root.json, null, 2)}`}</div>
  </>
};
