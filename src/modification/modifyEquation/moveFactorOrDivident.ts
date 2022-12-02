import { GEquation, GExpression, GProduct1D, GProduct2D, GQuotient1D, GQuotient2D, GSimpleValue } from "../../expression/gExpression";
import { ID, XDirection, XY, YDirection } from "../../types";
import { directionToXY, oppositeDirection } from "../../utils/general";

// // moveFactor, moveDivisor //////////////////////////////////////////////////////////////////////////////

export const moveFactor = ({ gEquation, id }: { gEquation: GExpression, id: ID }) => {
  if (!(gEquation instanceof GEquation)) return false; // Must be Equation

  const testFromTerm = (from: 1 | 2) => {
    let fromTerm = gEquation[`gTerm${from}`];
    if (!fromTerm) return null;

    if (fromTerm instanceof GProduct1D) {
      return fromTerm.gSimpleFactor?.id === id
        ? {
          moved: fromTerm.gSimpleFactor,
          remaining: fromTerm.gComplexFactor,
          startDirection: oppositeDirection(fromTerm.startDirection),
          is1D: true,
          from,
        }
        : null;
    } else if (fromTerm instanceof GProduct2D) {
      return fromTerm.gFactorX?.id === id
        ? {
          moved: fromTerm.gFactorX,
          remaining: fromTerm.gFactorY,
          movedXY: "X" as XY,
          remainingXY: "Y" as XY,
          is1D: false,
          from,
          fromTerm,
        }
        : fromTerm.gFactorY?.id === id
          ? {
            moved: fromTerm.gFactorY,
            remaining: fromTerm.gFactorX,
            movedXY: "Y" as XY,
            remainingXY: "X" as XY,
            is1D: false,
            from,
            fromTerm,
          }
          : null;
    }
    return null;
  };

  const {
    moved,
    remaining,
    startDirection,
    movedXY,
    remainingXY,
    is1D,
    from,
    fromTerm,
  } = testFromTerm(1) || testFromTerm(2) || {};

  if (!moved || !from) return false;

  const to = { [1]: 2, [2]: 1 }[from] as 1 | 2;
  const toTerm = gEquation[`gTerm${to}`];

  let newFromTerm, newToTerm;
  if (is1D) {
    moved._setParent(undefined, undefined);
    newFromTerm = remaining;
    newToTerm = new GQuotient1D();
    newToTerm.startDirection = startDirection;
    newToTerm.gComplexDivident = toTerm;
    newToTerm.gSimpleDivisor = moved as GSimpleValue;
  } else {
    // 2D

    moved._setParent(undefined, undefined);

    const divisorEdge = movedXY === 'X' ? fromTerm?.xEdge : fromTerm?.yEdge;
    const resultEdge = remainingXY === 'X' ? fromTerm?.xEdge : fromTerm?.yEdge;

    newFromTerm = remaining;
    newToTerm = new GQuotient2D();
    newToTerm.divisorEdge = divisorEdge;
    newToTerm.resultEdge = resultEdge;
    newToTerm.gDivident = toTerm;
    newToTerm.gDivisor = moved;
  }

  gEquation[`gTerm${from}`] = newFromTerm;
  gEquation[`gTerm${to}`] = newToTerm;

  return true;
};

export const moveDivisor = ({ gEquation, id }: { gEquation: GExpression, id: ID }) => {
  if (!(gEquation instanceof GEquation)) return false; // Must be Equation

  const testFromTerm = (from: 1 | 2) => {
    const fromTerm = gEquation[`gTerm${from}`];
    if (!fromTerm) return null;

    if (fromTerm instanceof GQuotient1D) {
      return fromTerm.gSimpleDivisor?.id === id
        ? {
          moved: fromTerm.gSimpleDivisor,
          remaining: fromTerm.gComplexDivident,
          startDirection: fromTerm.startDirection,
          is1D: true,
          from,
        }
        : {};
    } else if (fromTerm instanceof GQuotient2D) {
      const movedXY = directionToXY(fromTerm.resultEdge);
      const [xEdge, yEdge] =
        (movedXY === "X"
          ? [fromTerm.divisorEdge, fromTerm.resultEdge]
          : [fromTerm.resultEdge, fromTerm.divisorEdge]) as [YDirection, XDirection];

      return fromTerm.gDivisor?.id === id
        ? {
          moved: fromTerm.gDivisor,
          remaining: fromTerm.gDivident,
          xEdge,
          yEdge,
          movedXY,
          is1D: false,
          from,
        }
        : {};
    } else return null;
  };

  const {
    moved,
    remaining,
    startDirection,
    movedXY,
    xEdge,
    yEdge,
    is1D,
    from,
  } = testFromTerm(1) || testFromTerm(2) || {};

  if (!moved) return null;

  const to = { [1]: 2, [2]: 1 }[from] as 1 | 2;
  const toTerm = gEquation[`gTerm${to}`];

  let newFromTerm, newToTerm;
  if (is1D) {
    moved._setParent(undefined, undefined);
    newFromTerm = remaining;
    newToTerm = new GProduct1D();
    newToTerm.startDirection = startDirection;
    newToTerm.gComplexFactor = toTerm;
    newToTerm.gSimpleFactor = moved as GSimpleValue;
  } else {
    // 2D
    moved._setParent(undefined, undefined);
    newFromTerm = remaining;
    newToTerm = new GProduct2D();
    newToTerm.xEdge = xEdge;
    newToTerm.yEdge = yEdge;
    newToTerm.gFactorX = movedXY === "X" ? moved : toTerm;
    newToTerm.gFactorY = movedXY === "X" ? toTerm : moved;
  }

  gEquation[`gTerm${from}`] = newFromTerm;
  gEquation[`gTerm${to}`] = newToTerm;

  return true;
};
