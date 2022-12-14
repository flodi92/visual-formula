import { GAbstractDirectedExpression, GExpression, GProduct2D, GQuotient2D, GSimpleValue, GValue } from "../../expression/gExpression";
import { XY, XDirection, YDirection, Direction } from "../../types";
import Modification from "../Modification";
import { find } from "../../utils/expression";
import { oppositeDirection } from "../../utils/general";

export interface Reverse extends Modification { xy?: XY }

export const reverse = (expression: GExpression, { id, xy }: Reverse = {}) => {
  if (!xy) return false;
  const _reverse = (expression: GExpression): boolean => {
    if (!expression) return false;
    else if (expression instanceof GAbstractDirectedExpression) {
      expression.startDirection = oppositeDirection(expression.startDirection, xy);
    } else if (expression instanceof GProduct2D) {
      [expression.xEdge, expression.yEdge] = [
        oppositeDirection(expression.xEdge, xy) as YDirection | undefined,
        oppositeDirection(expression.yEdge, xy) as XDirection | undefined,
      ];
    } else if (expression instanceof GQuotient2D) {
      [expression.divisorEdge, expression.resultEdge] = [
        oppositeDirection(expression.divisorEdge, xy),
        oppositeDirection(expression.resultEdge, xy)];
    } else if (expression instanceof GValue) {
      [expression.xEdge, expression.yEdge] = [
        oppositeDirection(expression.xEdge, xy) as YDirection | undefined,
        oppositeDirection(expression.yEdge, xy) as XDirection | undefined,
      ];
    } else if (expression instanceof GSimpleValue) {
      expression.edge = oppositeDirection(expression.edge, xy) as Direction | undefined;
    }

    return (expression.children)?.reduce((prev, child) => {
      if (!!child && child instanceof GExpression)
        return prev && _reverse(child)
      else return true;
    }, true)
  };

  const _expression = !!id && !!expression ? find(id, expression) : expression;
  if (!_expression)
    return false;

  if (!_expression || !(_expression instanceof GExpression))
    return false;

  return _reverse(_expression);
};
