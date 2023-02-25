import { GAbstractDirectedExpression, GAbstractValue, GExpression, GProduct2D, GQuotient2D, GSimpleValue, GValue } from "../../expression/gExpression";
import { XDirection, YDirection } from "../../types";
import Modification from "../Modification";
import { find } from "../../utils/expression";
import { getSwappedDirection } from "../../utils/general";

export interface SwapXToY extends Modification { type?: 'swapXToY' }

export const swapXToY = (expression: GExpression, { id }: SwapXToY = {}) => {
  const _swapXToY = (expression: GExpression): boolean => {
    if (!expression) return false;
    else if (expression instanceof GAbstractDirectedExpression) {
      const startDirection = getSwappedDirection(expression.startDirection);
      expression.startDirection = startDirection;
    } else if (expression instanceof GProduct2D) {
      [expression.gFactorX, expression.gFactorY] = [expression.gFactorY, expression.gFactorX];
      [expression.xEdge, expression.yEdge] = [
        getSwappedDirection(expression.yEdge) as YDirection | undefined,
        getSwappedDirection(expression.xEdge) as XDirection | undefined,
      ];
    } else if (expression instanceof GQuotient2D) {
      [expression.divisorEdge, expression.resultEdge] = [
        getSwappedDirection(expression.divisorEdge),
        getSwappedDirection(expression.resultEdge)];
    } else if (expression instanceof GValue) {
      [expression.xEdge, expression.yEdge] = [
        getSwappedDirection(expression.yEdge) as YDirection | undefined,
        getSwappedDirection(expression.xEdge) as XDirection | undefined,
      ];
      [expression.unscaledHeight, expression.unscaledWidth]
        = [expression.unscaledWidth, expression.unscaledHeight]
    }
    else if (expression instanceof GSimpleValue) {
      expression.edge = getSwappedDirection(expression.edge);
      [expression.unscaledHeight, expression.unscaledWidth]
        = [expression.unscaledWidth, expression.unscaledHeight];
    }
    return (expression.children)?.reduce((prev, child) => {
      if (!!child && child instanceof GExpression)
        return prev && _swapXToY(child)
      else return true;
    }, true)
  };

  const _expression = find(id, expression);
  if (!_expression
    || !(_expression instanceof GExpression)
    || _expression instanceof GAbstractValue)
    return false;

  return _swapXToY(_expression);
};
