import {
  GProduct2D,
  GQuotient2D,
  GExpression,
  GAbstractDirectedExpression,
  GAbstractValue,
  GValue,
  GSimpleValue,
  GProduct1D,
  GQuotient1D,
} from "../expression/gExpression";
import { Direction, XDirection, YDirection, ID, XY } from "../types";
import { find, replace, } from "../utils/expression";
import {
  oppositeDirection,
  getRotatedDirection,
  getSwappedDirection,
  directionToXY,
  getOtherXY,
} from "../utils/general";
import Modification from "./Modification";
import { isNormableToXY, getXNeighbours, getYNeighbours } from "../utils/gExpression";
import { getMExpressionFromExpression } from "../conversion";

export interface SwapXToY extends Modification { }

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

export const swap1DAnd2D = (expression: GExpression,
  { id }: { id: ID }) => {
  if ([expression, id].some((val) => val == null)) return false;

  const term = find(id, expression);

  if (!(term.parent instanceof GExpression)) return false;

  const isParentNormed = term.parent?.isNormX || term.parent?.isNormY;

  let newTerm;
  if (term instanceof GProduct1D && !isParentNormed) {
    const canComplexXNorm = isNormableToXY(term.gComplexFactor, "X");
    const canComplexYNorm = isNormableToXY(term.gComplexFactor, "Y");

    const [factorFromComplex, factorFromSimple] =
      (canComplexXNorm && canComplexYNorm
        ? [
          `factor${directionToXY(term.startDirection)}`,
          `factor${getOtherXY(directionToXY(term.startDirection))}`,
        ]
        : canComplexXNorm && !canComplexYNorm
          ? ["gFactorY", "gFactorX"]
          : !canComplexYNorm && canComplexXNorm
            ? ["gFactorX", "gFactorY"]
            : []) as ['gFactorX' | 'gFactorY', 'gFactorX' | 'gFactorY'];

    if (!factorFromComplex && !factorFromSimple) return false; // gComplexFactor can neither be normed to x nor to y

    if (
      getXNeighbours(term).some(value => value.isNormX) ||
      getYNeighbours(term).some(value => value.isNormY)
    )
      return false;

    newTerm = new GProduct2D({
      id: term.id,
      [factorFromComplex]: term.gComplexFactor,
      [factorFromSimple]: new GValue(
        {
          id: term.gSimpleFactor?.id,
          numericValue: term.gSimpleFactor?.numericValue,
          mValue: term.gSimpleFactor?.mSimpleValue,
          xEdge: "bottom",
          yEdge: "right",
        }
      )
    });
  } else if (term instanceof GQuotient1D && !isParentNormed) {
    const canComplexXNorm = () => isNormableToXY(term.gComplexDivident, "X");
    const canComplexYNorm = () => isNormableToXY(term.gComplexDivident, "Y");

    const [divisorEdge, resultEdge] = (canComplexXNorm()
      ? ["left", "top"]
      : canComplexYNorm()
        ? ["top", "left"]
        : []) as [Direction, Direction];

    if (!divisorEdge && !resultEdge) return false; // gComplexDivident can neither be normed to x nor to y

    if (
      getXNeighbours(term).some(value => value.isNormX) ||
      getYNeighbours(term).some(value => value.isNormY)
    )
      return false;

    newTerm = new GQuotient2D({
        id: term.id,
        divisorEdge,
        resultEdge,
        gDivident: term.gComplexDivident,
        gDivisor: new GValue({
          id: term.gSimpleDivisor?.id,
          mValue: term.gSimpleDivisor?.mSimpleValue,
          numericValue: term.gSimpleDivisor?.numericValue,
          xEdge: "bottom",
          yEdge: "right",
        }),
      });
  } else if (term instanceof GProduct2D) {
    const [factorToSimple, factorToComplex, startDirection] =
      (term.gFactorY instanceof GValue
        ? ["gFactorY", "gFactorX", oppositeDirection(term.yEdge)]
        : term.gFactorX instanceof GValue
          ? ["gFactorX", "gFactorY", oppositeDirection(term.xEdge)]
          : []) as ["gFactorX" | "gFactorY", "gFactorX" | "gFactorY", Direction];

    if (!factorToSimple && !factorToComplex) return false; // none of the factors can be simplified

    newTerm = new GProduct1D({
        id: term.id,
        startDirection,
        gComplexFactor: term[factorToComplex],
        gSimpleFactor: new GSimpleValue({
          id: term[factorToSimple]?.id,
          numericValue: (term[factorToSimple] as GValue).numericValue,
          mSimpleValue: (term[factorToSimple] as GValue).mValue,
        })
      });
  } else if (term instanceof GQuotient2D) {
    if (!(term.gDivisor instanceof GValue)) return false; // gDivisor cannot be simplified

    newTerm = new GQuotient1D({
      id: term.id,
      startDirection: term.divisorEdge,
      gComplexDivident: term.gDivident,
      gSimpleDivisor: new GSimpleValue({
        id: term.gDivisor?.id,
        numericValue: term.gDivisor?.numericValue,
        mSimpleValue: term.gDivisor?.mValue,
      })

    })
  } else return false;

  newTerm && replace(id, expression, newTerm);

  return true;
};

export const substitute = (expression: GExpression,
  { id }: { id: ID }) => {
  const term = find(id, expression);

  if (term instanceof GAbstractValue || !(term instanceof GExpression)) return false;

  const mValue = getMExpressionFromExpression(term);

  if (!mValue) return false;
  const replacedTerm = new GValue({
    unscaledWidth: term.unscaledWidth,
    unscaledHeight: term.unscaledHeight,
    mValue: mValue,
    xEdge: "bottom",
    yEdge: "right",

  });

  replace(id, expression, replacedTerm);

  return true;
};
