import { cloneExpression } from "../../conversion";
import { GAbstractDirectedExpression, GAbstractRoot, GDifference, GExpression, GProduct1D, GProduct2D, GQuotient1D, GQuotient2D, GSum } from "../../expression/gExpression";
import { ID, XY } from "../../types";
import { find, replace } from "../../utils/expression";
import { directionToXY, isParallel, oppositeDirection } from "../../utils/general";
import { getSubtrahends, getSummands, setSubtrahends, setSummands } from "../../utils/gExpression";
import { reverse } from "../reconfigTerm";

// distributive operations //////////////////////////////////////////////
export const distribute = ({ expression, id, xy }
  : { expression: GAbstractRoot, id: ID, xy: XY }) => {
  //TODO idxs to distribute
  //TODO rename distribute

  if ([expression, id, xy].some((val) => val == null)) return false;
  const parent = find(id, expression);
  if (!parent) return false;

  let associateIn: GExpression | undefined;
  let associated: GExpression | undefined;
  let _getAssociatedChildren: (children: GExpression[], isOppositeEdge: boolean) => GExpression[];
  if (parent instanceof GProduct1D) {
    const startDirection = parent.startDirection;
    associated = parent.gSimpleFactor;
    associateIn = parent.gComplexFactor;
    if (directionToXY(startDirection) !== xy || !associated || !associateIn) return false;
    _getAssociatedChildren = (children) =>
      children.map(
        (child) =>
          new GProduct1D({
            gComplexFactor: child,
            gSimpleFactor: cloneExpression(<GExpression>associated),
            startDirection,
          })
      );
  } else if (parent instanceof GProduct2D) {
    const factorXEdge = parent.xEdge;
    const factorYEdge = parent.yEdge;
    [associated, associateIn] =
      xy === "X"
        ? [parent.gFactorY, parent.gFactorX]
        : [parent.gFactorX, parent.gFactorY];

    if (
      !associated || !(associated instanceof GAbstractDirectedExpression) ||
      !associateIn || !(associateIn instanceof GAbstractDirectedExpression) ||
      directionToXY(associateIn.startDirection) !== xy
    )
      return false;

    _getAssociatedChildren = (children, isOppositeEdge) => {
      const _associated = cloneExpression(associated as GExpression);
      isOppositeEdge && reverse(_associated, { xy, id: _associated.id });
      return children.map(
        (child) =>
          new GProduct2D(xy === "X"
            ? {
              gFactorX: child,
              gFactorY: _associated,
              // xEdge,
              yEdge: isOppositeEdge
                ? oppositeDirection(factorYEdge)
                : factorYEdge,
            }
            : {
              gFactorX: _associated,
              gFactorY: child,
              xEdge: isOppositeEdge
                ? oppositeDirection(factorXEdge)
                : factorXEdge,
              // yEdge,
            }
          )
      )
    };
  } else if (parent instanceof GQuotient1D) {
    const startDirection = parent.startDirection;
    associated = parent.gSimpleDivisor;
    associateIn = parent.gComplexDivident;
    if (directionToXY(startDirection) !== xy || !associated || !associateIn) return false;
    _getAssociatedChildren = (children) =>
      children.map((child) => {
        return new GQuotient1D({
          gComplexDivident: child,
          gSimpleDivisor: cloneExpression(associated as GExpression),
          startDirection,
        });
      });
  } else if (parent instanceof GQuotient2D) {
    const divisorEdge = parent.divisorEdge;
    const resultEdge = parent.resultEdge;
    associated = parent.gDivisor;
    associateIn = parent.gDivident;
    if (
      !associated || !(associated instanceof GAbstractDirectedExpression) ||
      !associateIn || !(associateIn instanceof GAbstractDirectedExpression) ||
      !associateIn.startDirection ||
      isParallel(associateIn.startDirection, divisorEdge) ||
      directionToXY(divisorEdge) === xy
    )
      return false;
    _getAssociatedChildren = (children, isOppositeEdge) => {
      const _associated = cloneExpression(associated as GAbstractDirectedExpression);
      isOppositeEdge && reverse(_associated, { xy });
      return children.map(
        (child) =>
          new GQuotient2D({
            gDivident: child,
            gDivisor: _associated,
            divisorEdge: isOppositeEdge
              ? oppositeDirection(divisorEdge)
              : divisorEdge,
            resultEdge,
          })
      );
    };
  } else {
    return false;
  }

  if (!(associateIn instanceof GSum) && !(associateIn instanceof GDifference)) return false;

  const summands = _getAssociatedChildren(getSummands(associateIn), false);
  const subtrahends = _getAssociatedChildren(getSubtrahends(associateIn), true);

  setSummands(associateIn, summands, associateIn.startDirection);
  !!subtrahends.length &&
    setSubtrahends(associateIn, subtrahends, associateIn.startDirection);


  replace(id, expression, associateIn);
  return true;
};
