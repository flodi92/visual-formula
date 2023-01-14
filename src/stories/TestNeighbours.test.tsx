import { getExpressionFromJSON } from "../conversion";
import { find } from "../utils/expression";
import { testNeighboursJSON1 } from "./TestNeighbours.stories";
import { Direction, ID } from '../types';
import { GAbstractRoot, GExpression } from "../expression/gExpression";
import { getCommonEdgeValues } from "../utils/gExpression";

const getResultCommonEdgeValues = (
  json: object,
  testedId: ID,
  direction: Direction,
) => {
  const expression = getExpressionFromJSON(json) as GAbstractRoot;
  const testedExpression = find(testedId, expression) as GExpression;
  return getCommonEdgeValues(testedExpression, direction).map(({ gValue, direction }) => `${gValue.id}:${direction}`)
}

test("getResultCommonEdgeValues", () => {

  expect(getResultCommonEdgeValues(testNeighboursJSON1, 7, 'right'))
    .toEqual(['8:left'])

  expect(getResultCommonEdgeValues(testNeighboursJSON1, 8, 'left'))
    .toEqual(['7:right'])

  expect(getResultCommonEdgeValues(testNeighboursJSON1, 7, 'left'))
    .toEqual(['6:right'])

  expect(getResultCommonEdgeValues(testNeighboursJSON1, 6, 'right'))
    .toEqual(['7:left'])

  expect(getResultCommonEdgeValues(testNeighboursJSON1, 7, 'bottom'))
    .toEqual(['11:top'])

  expect(getResultCommonEdgeValues(testNeighboursJSON1, 13, 'left'))
    .toEqual([])

  expect(getResultCommonEdgeValues(testNeighboursJSON1, 13, 'bottom'))
    .toEqual(['12:bottom', '11:bottom',])

  expect(getResultCommonEdgeValues(testNeighboursJSON1, 13, 'top'))
    .toEqual(['8:bottom', '12:top', '11:top'])

})