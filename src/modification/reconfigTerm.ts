import {
  GProduct2D,
  GQuotient2D,
  GExpression,
  GAbstractDirectedExpression,
  GAbstractValue,
} from "../expression/gExpression";
import { ID, XDirection, XY, YDirection } from "../types";
import { find } from "../utils/expression";
import { oppositeDirection, getRotatedDirection, getSwappedDirection } from "../utils/general";

export const swapXToY = ({ expression, id }:
  { expression: GExpression, id: ID }) => {
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
    } else if (expression instanceof GAbstractValue) {
      /* nothing */
    } else {
      return false;
    }
    return (expression.children)?.reduce((prev, child) => {
      if (!!child && child instanceof GExpression)
        return prev && _swapXToY(child)
      else return true;
    }, true)
  };

  const _expression = find(id, expression);
  if (!_expression || _expression instanceof GAbstractValue)
    return false;

  return _swapXToY(_expression);
};

export const rotate = ({ expression, id, isClockwise }:
  { expression: GExpression, id: ID, isClockwise: boolean }) => {
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
    } else if (expression instanceof GAbstractValue) {
      /* nothing */
    } else {
      return false;
    }
    return (expression.children)?.reduce((prev, child) => {
      if (!!child && child instanceof GExpression)
        return prev && _rotate(child)
      else return true;
    }, true)
  };

  const _expression = find(id, expression);
  if (!_expression || _expression instanceof GAbstractValue)
    return false;

  return _rotate(_expression);
};

export const reverse = ({ expression, id, xy }:
  { expression?: GExpression, id?: ID, xy: XY }) => {
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
    } else if (expression instanceof GAbstractValue) {
      /* nothing */
    } else {
      return false;
    }
    return (expression.children)?.reduce((prev, child) => {
      if (!!child && child instanceof GExpression)
        return prev && _reverse(child)
      else return true;
    }, true)
  };

  const _expression = !!id && !!expression ? find(id, expression) : expression;
  if (!_expression || _expression instanceof GAbstractValue)
    return false;

  return _reverse(_expression);
};

// export const swap1DAnd2D = ({ expression, id }:
//   { expression: GExpression, id: ID }) => {
//   if ([expression, id].some((val) => val == null)) return false;

//   const term = find(id, expression);

//   if(!(term.parent instanceof GExpression)) return false;

//   const parent = term.parent 
//   const isParentNormed = term.parent?.isNormX || term.parent?.isNormY;

//   let newTerm;
//   if (term instanceof GProduct1D && !isParentNormed) {
//     const canComplexXNorm = isNormableToXY(term.complexFactor(), "X");
//     const canComplexYNorm = isNormableToXY(term.complexFactor(), "Y");

//     const [factorFromComplex, factorFromSimple] =
//       canComplexXNorm && canComplexYNorm
//         ? [
//           `factor${directionToXY(term.startDirection)}`,
//           `factor${getOtherXY(directionToXY(term.startDirection))}`,
//         ]
//         : canComplexXNorm && !canComplexYNorm
//           ? ["factorY", "factorX"]
//           : !canComplexYNorm && canComplexXNorm
//             ? ["factorX", "factory"]
//             : [];

//     if (!factorFromComplex && !factorFromSimple) return false; // complexFactor can neither be normed to x nor to y

//     if (

//       term.getXNeighbours().some((value) => value.isXNorm()) ||
//       term.getYNeighbours().some((value) => value.isYNorm())
//     )
//       return false;

//     newTerm = new GProduct2D({
//       id: term.id(),
//       [factorFromComplex]: term.complexFactor(),
//       [factorFromSimple]: new GValue({
//         id: term.simpleFactor()?.id(),
//         value: term.simpleFactor()?.value(),
//         xEdge: "bottom",
//         yEdge: "right",
//       }),
//       factorXEdge: term.startDirection === "top" ? "bottom" : "top",
//       factorYEdge: term.startDirection === "left" ? "right" : "left",
//     });
//   } else if (term.type() === "GQuotient1D" && !isParentNormed) {
//     const canComplexXNorm = () => isNormableToXY(term.complexDivident(), "X");
//     const canComplexYNorm = () => isNormableToXY(term.complexDivident(), "Y");

//     const [divisorEdge, resultEdge] = canComplexXNorm()
//       ? ["left", "top"]
//       : canComplexYNorm()
//         ? ["top", "left"]
//         : [];

//     if (!divisorEdge && !resultEdge) return false; // complexDivident can neither be normed to x nor to y

//     if (
//       term.getXNeighbours().some((value) => value.isXNorm()) ||
//       term.getYNeighbours().some((value) => value.isYNorm())
//     )
//       return false;

//     newTerm = new GQuotient2D({
//       id: term.id(),
//       divident: term.complexDivident(),
//       divisor: new GValue({
//         id: term.simpleDivisor()?.id(),
//         value: term.simpleDivisor()?.value(),
//         xEdge: "bottom",
//         yEdge: "right",
//       }),
//       divisorEdge,
//       resultEdge,
//     });
//   } else if (term.type() === "GProduct2D") {
//     const [factorToSimple, factorToComplex, startDirection] =
//       term.factorY()?.type() === "GValue"
//         ? ["factorY", "factorX", getOpposite(term.factorYEdge())]
//         : term.factorX()?.type() === "GValue"
//           ? ["factorX", "factorY", getOpposite(term.factorXEdge())]
//           : [];

//     if (!factorToSimple && !factorToComplex) return false; // none of the factors can be simplified

//     newTerm = new GProduct1D({
//       id: term.id(),
//       complexFactor: term[factorToComplex](),
//       simpleFactor: new GSimpleValue({
//         id: term[factorToSimple]()?.id(),
//         value: term[factorToSimple]()?.value(),
//       }),
//       startDirection,
//     });
//   } else if (term.type() === "GQuotient2D") {
//     if (term.divisor()?.type() !== "GValue") return false; // divisor cannot be simplified

//     const startDirection = term.divisorEdge();

//     newTerm = new GQuotient1D({
//       id: term.id(),
//       complexDivident: term.divident(),
//       simpleDivisor: new GSimpleValue({
//         id: term.divisor()?.id(),
//         value: term.divisor()?.value(),
//       }),
//       startDirection,
//     });
//   } else return false;

//   replaceTerm(expression, id, newTerm);

//   return true;
// };

// export const substitute = ({ expression, id }:
//   { expression: GExpression, id: ID }) => {
//   const term = find(id, expression);
//   if (term instanceof GAbstractValue) return false;
//   const mValue = term.mExpression;

//   if (!mValue) return false;
//   const replacedTerm = new GValue();
//   replacedTerm.mValue = mValue;
//   replacedTerm.xEdge = "top";
//   replacedTerm.yEdge = "left";

//   replace(id, expression, replacedTerm);
//   return true;
// };

// const suggestStartDirection = (term) => {
//   if (term.parent().startDirection) return term.parent().startDirection;
//   if (term.isXNorm()) return "top";
//   return "left";
// };

// export const unsubstitute = ({ expression, id }:
//   { expression: GExpression, id: ID }) => {
//   const term = find(id, expression);
//   if (term.type() !== "GValue") return false;

//   const mTerm = term.value();

//   const _getGTerm = (mTerm) => {
//     switch (mTerm?.type()) {
//       case "MSum":
//         return new GSum({
//           id: term.id(),
//           summands: mTerm.mSummands().map((value) => new GValue({ value })),
//           startDirection: suggestStartDirection(mTerm),
//         });
//       case "MDifference":
//         return new GDifference({
//           id: term.id(),
//           minuend: mTerm.mMinuend(),
//           subtrahend: mTerm.mSubtrahhend(),
//           startDirection: suggestStartDirection(mTerm),
//         });
//       case "MProduct":
//         const [mFactor1, mFactor2, ...rest] = mTerm.mFactors();
//         if (rest.length) return null;

//         if (
//           term?.isXNorm() ||
//           term.getYNeighbours()?.some((neighbour) => neighbour.isYNorm())
//         ) {
//           return new GProduct1D({
//             id: term.id(),
//             complexFactor: new GValue({ value: mFactor1 }),
//             simpleFactor: new GSimpleValue({ value: mFactor2 }),
//             startDirection: "top",
//           });
//         } else if (
//           term?.isYNorm() ||
//           term.getXNeighbours()?.some((neighbour) => neighbour.isXNorm())
//         ) {
//           return new GProduct1D({
//             id: term.id(),
//             complexFactor: new GValue({ value: mFactor1 }),
//             simpleFactor: new GSimpleValue({ value: mFactor2 }),
//             startDirection: "left",
//           });
//         } else {
//           return new GProduct2D({
//             id: term.id(),
//             factorX: new GValue({ value: mFactor1 }),
//             factorY: new GValue({ value: mFactor2 }),
//           });
//         }
//       case "MQuotient":
//         const [mDivident, mDivisor] = [mTerm.mDivident(), mTerm.mDivisor()];

//         if (
//           term?.isXNorm() ||
//           term.getYNeighbours()?.some((neighbour) => neighbour.isYNorm())
//         ) {
//           return new GQuotient1D({
//             id: term.id(),
//             complexDivident: new GValue({ value: mDivident }),
//             simpleDivisor: new GSimpleValue({ value: mDivisor }),
//             startDirection: "top",
//           });
//         } else if (
//           term?.isYNorm() ||
//           term.getXNeighbours()?.some((neighbour) => neighbour.isXNorm())
//         ) {
//           return new GQuotient1D({
//             id: term.id(),
//             complexDivident: new GValue({ value: mDivident }),
//             simpleFactor: new GSimpleValue({ value: mDivisor }),
//             startDirection: "left",
//           });
//         } else {
//           return new GProduct2D({
//             id: term.id(),
//             factorX: new GValue({ value: mDivident }),
//             factorY: new GValue({ value: mDivisor }),
//           });
//         }
//     }
//     return null;
//   };

//   const gTerm = _getGTerm(mTerm);

//   if (!gTerm) return false;

//   replaceTerm(expression, id, gTerm);

//   return true;
// };
