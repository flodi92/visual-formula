import { GAbstractDirectedExpression, GExpression, GProduct2D, GQuotient2D, GSimpleValue, GValue } from "../../expression/gExpression";
import { XDirection, YDirection } from "../../types";
import { find } from "../../utils/expression";
import { getRotatedDirection } from "../../utils/general";
import Modification from "../Modification";

export interface Rotate extends Modification { isClockwise?: boolean }

export const rotate = (expression: GExpression, { id, isClockwise = false }: Rotate = {}) => {
  const _rotate = (expression: GExpression): boolean => {
    if (!expression) return false;
    else if (expression instanceof GAbstractDirectedExpression) {
      const startDirection = getRotatedDirection(expression.startDirection, isClockwise);
      expression.startDirection = startDirection;
    } else if (expression instanceof GProduct2D) {
      [expression.gFactorX, expression.gFactorY] = [expression.gFactorY, expression.gFactorX];
      [expression.xEdge, expression.yEdge] = [
        getRotatedDirection(expression.yEdge, isClockwise) as YDirection | undefined,
        getRotatedDirection(expression.xEdge, isClockwise) as XDirection | undefined,
      ];
    } else if (expression instanceof GQuotient2D) {
      [expression.divisorEdge, expression.resultEdge] = [
        getRotatedDirection(expression.divisorEdge, isClockwise),
        getRotatedDirection(expression.resultEdge, isClockwise)];
    } else if (expression instanceof GValue) {
      [expression.xEdge, expression.yEdge] = [
        getRotatedDirection(expression.yEdge, isClockwise) as YDirection | undefined,
        getRotatedDirection(expression.xEdge, isClockwise) as XDirection | undefined,
      ];
      [expression.unscaledHeight, expression.unscaledWidth]
        = [expression.unscaledWidth, expression.unscaledHeight]
    }
    else if (expression instanceof GSimpleValue) {
      expression.edge = getRotatedDirection(expression.edge, isClockwise);
      [expression.unscaledHeight, expression.unscaledWidth]
        = [expression.unscaledWidth, expression.unscaledHeight];
    }
    return (expression.children)?.reduce((prev, child) => {
      if (!!child && child instanceof GExpression)
        return prev && _rotate(child)
      else return true;
    }, true)
  };

  const _expression = !!id && !!expression ? find(id, expression) : expression;
  if (!_expression || !(_expression instanceof GExpression))
    return false;

  return _rotate(_expression);
};
