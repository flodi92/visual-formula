import { GExpression, GProduct1D, GProduct2D, GSimpleValue, GSum, GValue } from "../expression/gExpression";
import { ID } from "../types";
import { find } from "../utils/expression";
import { reverse } from "./reconfigTerm";

// commutative operations //////////////////////////////////

export const swapSummands = ({ expression, id, indexA, indexB, }:
  { expression: GExpression, id: ID, indexA: number, indexB: number }) => {
  const sum = find(id, expression);

  if (!sum || !(sum instanceof GSum)) return false;
  const gSummands = sum.gSummands;
  const gSummandA = gSummands && gSummands[indexA];
  const gSummandB = gSummands && gSummands[indexB];

  if (!gSummandA || !gSummandB) return false;
  gSummands[indexA] = gSummandB;
  gSummands[indexB] = gSummandA;
  sum.gSummands = gSummands;

  return true;
};

export const swapFactors1D = ({ expression, id }:
  { expression: GExpression, id: ID }) => {
  const term = find(id, expression);

  if (term instanceof GProduct1D) {
    const gComplexFactor = term.gComplexFactor;
    const gSimpleFactor = term.gSimpleFactor;
    if (!gComplexFactor || !gSimpleFactor ||
      !(gComplexFactor instanceof GValue) ||
      !(gSimpleFactor instanceof GSimpleValue)
    )
      return false;
    const [a, b] = [gComplexFactor.mValue, gSimpleFactor.mSimpleValue];
    gComplexFactor.mValue = b;
    gSimpleFactor.mSimpleValue = a;
  } //Would be mathmatically incorrect for GQuotient1D
  else return false;
  return true;
};

export const swapFactors2D = ({ expression, id }:
  { expression: GExpression, id: ID }) => {
  const term = find(id, expression);

  if (!(term instanceof GProduct2D)) return false;

  let [gFactorX, gFactorY] = [term.gFactorX, term.gFactorY];
  const [xEdge, yEdge] = [term.xEdge, term.yEdge];

  let success = false;

  success = reverse({ expression: gFactorX, xy: "Y" });
  success = success && reverse({ expression: gFactorY, xy: "X" });

  // success = success && rotate({
  //   expression: gFactorX,
  //   isClockwise: isClockwise(yEdge, xEdge),
  // });

  // success = success && rotate({
  //   expression: gFactorY,
  //   isClockwise: isClockwise(xEdge, yEdge),
  // });

  if (!success || !term.gFactorX || !term.gFactorY) return false;

  // (term.gFactorX as GExpression).parent = undefined;
  // (term.gFactorY as GExpression).parent = undefined;

  term.gFactorX = gFactorY;
  term.gFactorY = gFactorX;

  return true;
};

// // associative operations ///////////////////////////////////////////////

// /* TODO */

// // distributive operations //////////////////////////////////////////////
// export const distribute = ({ expression, id, xy }) => {
//   //TODO idxs to distribute
//   //TODO rename distribute

//   if ([expression, id, xy].some((val) => val == null)) return false;
//   const parent = find(expression, id);
//   if (!parent) return false;

//   let associateIn, associated, _getAssociatedChildren;
//   if (parent.type() === "GProduct1D") {
//     const startDirection = parent.startDirection();
//     if (directionToXY(startDirection) !== xy) return false;
//     associated = parent.simpleFactor();
//     associateIn = parent.complexFactor();
//     _getAssociatedChildren = (children) =>
//       children.map(
//         (child) =>
//           new GProduct1D({
//             complexFactor: child,
//             simpleFactor: associated.clone(true),
//             startDirection,
//           })
//       );
//   } else if (parent.type() === "GProduct2D") {
//     const factorXEdge = parent.factorXEdge();
//     const factorYEdge = parent.factorYEdge();
//     [associated, associateIn] =
//       xy === "X"
//         ? [parent.factorY(), parent.factorX()]
//         : [parent.factorX(), parent.factorY()];

//     if (
//       !associateIn.startDirection ||
//       directionToXY(associateIn.startDirection()) !== xy
//     )
//       return false;

//     _getAssociatedChildren = (children, isOppositeEdge) => {
//       const _associated = associated.clone(true);
//       isOppositeEdge && reverse({ expression: _associated, xy });
//       return children.map(
//         (child) =>
//           new GProduct2D({
//             ...(xy === "X"
//               ? {
//                 factorX: child,
//                 factorY: _associated,
//                 factorXEdge,
//                 factorYEdge: isOppositeEdge
//                   ? getOpposite(factorYEdge)
//                   : factorYEdge,
//               }
//               : {
//                 factorX: _associated,
//                 factorY: child,
//                 factorXEdge: isOppositeEdge
//                   ? getOpposite(factorXEdge)
//                   : factorXEdge,
//                 factorYEdge,
//               }),
//           })
//       );
//     };
//   } else if (parent.type() === "GQuotient1D") {
//     const startDirection = parent.startDirection();
//     if (directionToXY(startDirection) !== xy) return false;
//     associated = parent.simpleDivisor();
//     associateIn = parent.complexDivident();
//     _getAssociatedChildren = (children) =>
//       children.map((child) => {
//         return new GQuotient1D({
//           complexDivident: child,
//           simpleDivisor: associated.clone(true),
//           startDirection,
//         });
//       });
//   } else if (parent.type() === "GQuotient2D") {
//     const divisorEdge = parent.divisorEdge();
//     const resultEdge = parent.resultEdge();
//     associated = parent.divisor();
//     associateIn = parent.divident();
//     if (
//       !associateIn.startDirection ||
//       isParallel(associateIn.startDirection(), divisorEdge) ||
//       directionToXY(divisorEdge) === xy
//     )
//       return false;
//     _getAssociatedChildren = (children, isOppositeEdge) => {
//       const _associated = associated.clone(true);
//       isOppositeEdge && reverse({ expression: _associated, xy });
//       return children.map(
//         (child) =>
//           new GQuotient2D({
//             divident: child,
//             divisor: _associated,
//             divisorEdge: isOppositeEdge
//               ? getOpposite(divisorEdge)
//               : divisorEdge,
//             resultEdge,
//           })
//       );
//     };
//   } else {
//     return false;
//   }

//   if (!["GSum", "GDifference"].includes(associateIn.type())) return false;

//   const summands = _getAssociatedChildren(getSummands(associateIn));
//   const subtrahends = _getAssociatedChildren(getSubtrahends(associateIn), true);

//   setSummands(associateIn, summands, associateIn.startDirection());
//   !!subtrahends.length &&
//     setSubtrahends(associateIn, subtrahends, associateIn.startDirection());

//   replaceTerm(expression, id, associateIn);
//   return true;
// };

// export const reverseDistribute = ({ expression, id, xy }) => {
//   if ([expression, id, xy].some((val) => val == null)) return false;

//   const parent = find(expression, id);

//   if (!["GSum", "GDifference"].includes(parent?.type())) return false;

//   const summands = getSummands(parent);
//   const subtrahends = getSubtrahends(parent);
//   const children = [...summands, ...subtrahends];

//   let associateds, associateInSummands, associateInSubtrahends, _getNewParent;

//   if (!children.length) return false;

//   //GProduct1D
//   if (
//     children.every(
//       (c) =>
//         c.type() === "GProduct1D" &&
//         c.startDirection() === children[0].startDirection()
//     )
//   ) {
//     associateds = children.map((c) => c.simpleFactor());
//     associateInSummands = summands.map((c) => c.complexFactor());
//     associateInSubtrahends = subtrahends.map((c) => c.complexFactor());
//     _getNewParent = (associated, complex) =>
//       new GProduct1D({
//         complexFactor: complex,
//         simpleFactor: associated,
//         startDirection: children[0].startDirection(),
//       });
//   }
//   //GProduct2D
//   else if (children.every((c) => c.type() === "GProduct2D")) {
//     const [associatedFactor, associateInFactor] =
//       xy === "X" ? ["factorY", "factorX"] : ["factorX", "factorY"];
//     associateds = children.map((c) => c[associatedFactor]());
//     associateInSummands = summands.map((c) => c[associateInFactor]());
//     associateInSubtrahends = subtrahends.map((c) => c[associateInFactor]());
//     _getNewParent = (associated, complex) =>
//       new GProduct2D({
//         [associateInFactor]: complex,
//         [associatedFactor]: cloneDeep(associated),
//         factorXEdge: children[0].factorXEdge(),
//         factorYEdge: children[0].factorYEdge(),
//       });
//   }
//   //GQuotient1D
//   else if (
//     children.every(
//       (c) =>
//         c.type() === "GQuotient1D" &&
//         c.startDirection() === children[0].startDirection()
//     )
//   ) {
//     associateds = children.map((c) => c.simpleDivisor());
//     associateInSummands = summands.map((c) => c.complexDivident());
//     associateInSubtrahends = subtrahends.map((c) => c.complexDivident());
//     _getNewParent = (associated, complex) =>
//       new GQuotient1D({
//         complexDivident: complex,
//         simpleDivisor: cloneDeep(associated),
//         startDirection: children[0].startDirection(),
//       });
//   }
//   //GQuotient2D
//   else if (children.every((c) => c.type() === "GQuotient2D")) {
//     associateds = children.map((c) => c.divisor());
//     associateInSummands = summands.map((c) => c.divident());
//     associateInSubtrahends = subtrahends.map((c) => c.divident());
//     _getNewParent = (associated, complex) =>
//       new GQuotient2D({
//         divisor: cloneDeep(associated),
//         divident: complex,
//         divisorEdge: children[0].divisorEdge(),
//         resultEdge: children[0].resultEdge(),
//       });
//   } else return false;

//   if (
//     associateds.some(
//       (child) =>
//         child.toString(false, false) !== associateds[0].toString(false, false)
//     )
//   )
//     return false;

//   let complex = setSummands(null, associateInSummands, parent.startDirection());
//   if (!!associateInSubtrahends.length)
//     complex = setSubtrahends(
//       complex,
//       associateInSubtrahends,
//       parent.startDirection()
//     );
//   const newParent = _getNewParent(associateds[0], complex);

//   replaceTerm(expression, id, newParent);

//   return true;
// };
