import React from 'react';
import './button.css';

import GAbstractRoot from '../expression/gExpression/GAbstractRoot';
import DrawRoot from '../draw/DrawRoot';
import { getExpressionFromJSON } from '../conversion';
import { rotate } from '../modification/reconfigTerm';
import { XY, Direction, ID } from '../types';
import { getCommonEdgeValues, getNeighbours } from '../utils/gExpression';
import { find } from '../utils/expression';
import { GExpression } from '../expression/gExpression';

export interface TestNeighboursProps {
  rotations: 0 | 1 | 2 | 3,
  json: object,
  layerTransformation: { x: number, y: number, scaleX: number, scaleY: number },
  testedId: ID,
  operation: { type: 'getNeighbours', xy: XY } | { type: 'getCommonEdgeValues', direction: Direction }
}

export const TestNeighbours = ({ rotations, json, layerTransformation, testedId, operation }: TestNeighboursProps) => {
  const expression = getExpressionFromJSON(json) as GAbstractRoot;

  const testedExpression = find(testedId, expression) as GExpression;

  for (let index = 0; index < rotations; index++)
    rotate(expression);

  expression.layerTransformation = layerTransformation;

  const results = (operation.type === "getNeighbours" ?
    getNeighbours(testedExpression, operation.xy).map(({ id }) => `${id}`) :
    getCommonEdgeValues(testedExpression, operation.direction).map(({ gValue: { id }, direction }) => `${id}:${direction}`)
  ).join(', ');

  const operationDefinition = `${operation.type}:${operation.type === "getNeighbours" ? operation.xy : operation.direction}`
  
  return <>
    <>{operationDefinition} of {testedId} are {results}</>
    <DrawRoot root={expression} drawIds style={{ width: '100%', height: '200px', }} />
    <div style={{ whiteSpace: "pre", fontSize: "10px" }}>{`${JSON.stringify(expression.json, null, 2)}`}</div>
  </>
};
