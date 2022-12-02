import { GEquation, GExpression } from "../expression/gExpression";
import { ID } from "../types";
import { isParallel, oppositeDirection } from "../utils/general";
import { getSummands, setSummands, getSubtrahends, setSubtrahends, sumStartDirection, differenceStartDirection } from "../utils/gExpression";

// // moveSummand, moveSubtrahend ////////////////////////////////////////////////////
const moveSummandOrSubtrahend = (
  { gEquation, id, isSummand }: { gEquation: GExpression, id: ID, isSummand: boolean }
): boolean => {
  if (!(gEquation instanceof GEquation)) return false; // Must be GEquation

  const testFromTerm = (from: 1 | 2, to: 1 | 2) => {
    let fromTerm = gEquation[`gTerm${from}`];
    let toTerm = gEquation[`gTerm${to}`];

    if (!fromTerm) return null;

    let fromChildren = isSummand ? getSummands(fromTerm) : getSubtrahends(fromTerm);

    if (!fromChildren?.length) return null;

    const firstFrom = fromChildren[0];
    const lastFrom = fromChildren[fromChildren.length - 1];

    let fromDirection = (isSummand
      ? sumStartDirection(fromTerm)
      : differenceStartDirection(fromTerm));

    let toDirection = (isSummand
      ? differenceStartDirection(toTerm)
      : sumStartDirection(toTerm));

    if (!fromDirection) fromDirection = toDirection;
    if (!toDirection) toDirection = fromDirection;
    if (!fromDirection && !toDirection) fromDirection = toDirection = "left";

    if (
      firstFrom.id === id && (fromDirection === toDirection)
    )
      return {
        moved: firstFrom,
        remaining: fromChildren.slice(1, fromChildren.length),
        fromDirection,
        from,
        fromTerm,
        movedEnd: "first",
      };
    else if (
      lastFrom.id === id && (oppositeDirection(fromDirection) === toDirection)
    )
      return {
        moved: lastFrom,
        remaining: fromChildren.slice(0, fromChildren.length - 1),
        fromDirection,
        from,
        fromTerm,
        movedEnd: "last",
      };
    else return null;
  };

  const {
    moved,
    remaining,
    fromDirection: _fromDirection,
    from,
    fromTerm,
    movedEnd,
  } = testFromTerm(1, 2) || testFromTerm(2, 1) || {};

  if (!moved) return false;

  const to = from && { [1]: 2, [2]: 1 }[from] as 1 | 2 | undefined;
  const toTerm = !!to ? gEquation[`gTerm${to}`] : undefined;
  const _toDirection = isSummand
    ? differenceStartDirection(toTerm)
    : sumStartDirection(toTerm);
  let toChildren = isSummand ? getSubtrahends(toTerm) : getSummands(toTerm);

  const fromDirection = _fromDirection || _toDirection || "left";
  const toDirection = _toDirection || fromDirection || "left";

  let newToChildren;
  if (isParallel(fromDirection, toDirection)) {
    newToChildren =
      (fromDirection === toDirection) !== (movedEnd === "first")
        ? [...toChildren, moved]
        : [moved, ...toChildren];
  } else {
    return false;
  }

  const [newFromTerm, newToTerm] = isSummand ?
    [
      setSummands(fromTerm, remaining, fromDirection),
      setSubtrahends(toTerm, newToChildren, toDirection)
    ] :
    [
      setSubtrahends(fromTerm, remaining, fromDirection),
      setSummands(toTerm, newToChildren, toDirection)
    ];

  from && (gEquation[`gTerm${from}`] = newFromTerm);
  to && (gEquation[`gTerm${to}`] = newToTerm);

  return true;
};

export const moveSummand = (
  { gEquation, id }: { gEquation: GExpression, id: ID }
): boolean =>
  moveSummandOrSubtrahend({ gEquation, id, isSummand: true });

export const moveSubtrahend = (
  { gEquation, id }: { gEquation: GExpression, id: ID }
): boolean =>
  moveSummandOrSubtrahend({ gEquation, id, isSummand: false });

// // moveFactor, moveDivisor //////////////////////////////////////////////////////////////////////////////

// export const moveFactor = ({ expression: equation, id }) => {
//   if (equation.type() !== "GEquation") return false; // Must be Equation

//   const testFromTerm = (from) => {
//     const fromTerm = equation[`term${from}`]();
//     if (!fromTerm) return null;

//     if (fromTerm.type() === "GProduct1D") {
//       return fromTerm.simpleFactor()?.id() === id
//         ? {
//             moved: fromTerm.simpleFactor(),
//             remaining: fromTerm.complexFactor(),
//             startDirection: getOpposite(fromTerm.startDirection()),
//             is1D: true,
//             from,
//           }
//         : null;
//     } else if (fromTerm.type() === "GProduct2D") {
//       return fromTerm.factorX()?.id() === id
//         ? {
//             moved: fromTerm.factorX(),
//             remaining: fromTerm.factorY(),
//             movedXY: "X",
//             remainingXY: "Y",
//             is1D: false,
//             from,
//             fromTerm,
//           }
//         : fromTerm.factorY()?.id() === id
//         ? {
//             moved: fromTerm.factorY(),
//             remaining: fromTerm.factorX(),
//             movedXY: "Y",
//             remainingXY: "X",
//             is1D: false,
//             from,
//             fromTerm,
//           }
//         : null;
//     }
//     return null;
//   };

//   const {
//     moved,
//     remaining,
//     startDirection,
//     movedXY,
//     remainingXY,
//     is1D,
//     from,
//     fromTerm,
//   } = testFromTerm("1") || testFromTerm("2") || {};

//   if (!moved) return false;

//   const to = getOtherTerm(from);
//   const toTerm = equation[`term${to}`]();

//   let newFromTerm, newToTerm;
//   if (is1D) {
//     moved.setParent(null, null);
//     newFromTerm = remaining;
//     newToTerm = new GQuotient1D({
//       startDirection,
//       complexDivident: toTerm,
//       simpleDivisor: moved,
//     });
//   } else {
//     // 2D
//     moved.setParent(null, null);
//     const divisorEdge = fromTerm[`factor${movedXY}Edge`]();
//     const resultEdge = fromTerm[`factor${remainingXY}Edge`]();
//     newFromTerm = remaining;
//     newToTerm = new GQuotient2D({
//       divisorEdge,
//       resultEdge,
//       divident: toTerm,
//       divisor: moved,
//     });
//   }

//   equation[`setTerm${from}`](newFromTerm);
//   equation[`setTerm${to}`](newToTerm);

//   return true;
// };

// export const moveDivisor = ({ expression: equation, id }) => {
//   if (equation.type() !== "GEquation") return false; // Must be Equation

//   const testFromTerm = (from) => {
//     const fromTerm = equation[`term${from}`]();
//     if (!fromTerm) return null;

//     if (fromTerm.type() === "GQuotient1D") {
//       return fromTerm.simpleDivisor()?.id() === id
//         ? {
//             moved: fromTerm.simpleDivisor(),
//             remaining: fromTerm.complexDivident(),
//             startDirection: fromTerm.startDirection(),
//             is1D: true,
//             from,
//           }
//         : {};
//     } else if (fromTerm.type() === "GQuotient2D") {
//       const movedXY = directionToXY(fromTerm.resultEdge());
//       const [xEdge, yEdge] =
//         movedXY === "X"
//           ? [fromTerm.divisorEdge(), fromTerm.resultEdge()]
//           : [fromTerm.resultEdge(), fromTerm.divisorEdge()];
//       return fromTerm.divisor()?.id() === id
//         ? {
//             moved: fromTerm.divisor(),
//             remaining: fromTerm.divident(),
//             xEdge,
//             yEdge,
//             movedXY,
//             is1D: false,
//             from,
//           }
//         : {};
//     } else return null;
//   };

//   const {
//     moved,
//     remaining,
//     startDirection,
//     movedXY,
//     xEdge,
//     yEdge,
//     is1D,
//     from,
//   } = testFromTerm("1") || testFromTerm("2") || {};

//   if (!moved) return null;

//   const to = getOtherTerm(from);
//   const toTerm = equation[`term${to}`]();

//   let newFromTerm, newToTerm;
//   if (is1D) {
//     moved.setParent(null, null);
//     newFromTerm = remaining;
//     newToTerm = new GProduct1D({
//       startDirection,
//       complexFactor: toTerm,
//       simpleFactor: moved,
//     });
//   } else {
//     // 2D
//     moved.setParent(null, null);
//     newFromTerm = remaining;
//     newToTerm = new GProduct2D({
//       factorXEdge: xEdge,
//       factorYEdge: yEdge,
//       factorX: movedXY === "X" ? moved : toTerm,
//       factorY: movedXY === "X" ? toTerm : moved,
//     });
//   }

//   equation[`setTerm${from}`](newFromTerm);
//   equation[`setTerm${to}`](newToTerm);

//   return true;
// };

// const getMovedSummandOrSubtrahend = ({
//   equation,
//   to,
//   movedDirection,
//   isSummand,
// }) => {
//   if (equation.type() !== "GEquation") return {}; // Must be Equation

//   const from = getOtherTerm(to);

//   const fromTerm = equation[`term${from}`]();
//   const toTerm = equation[`term${to}`]();

//   const fromChildren = isSummand
//     ? getSummands(fromTerm)
//     : getSubtrahends(fromTerm);

//   let [fromDirection, toDirection] = isSummand
//     ? [sumStartDirection(fromTerm), differenceStartDirection(toTerm)]
//     : [differenceStartDirection(toTerm), sumStartDirection(fromTerm)];

//   fromDirection = fromDirection || toDirection || movedDirection;
//   toDirection = toDirection || fromDirection || movedDirection;

//   const isOpposite =
//     fromDirection === movedDirection
//       ? true
//       : fromDirection === getOpposite(movedDirection)
//       ? false
//       : null;

//   if (isOpposite === null && fromChildren.length > 1) return {}; // moved direction invalid

//   const [moved, remaining] =
//     fromChildren.length === 0
//       ? [null, []]
//       : fromChildren.length === 1
//       ? [fromChildren[0], []]
//       : isOpposite
//       ? [_.head(fromChildren), _.tail(fromChildren)]
//       : [_.last(fromChildren), _.tail(fromChildren.reverse()).reverse()];

//   return { moved, remaining, fromDirection, toDirection };
// };

// const moveSummandOrSubtrahend = ({
//   equation,
//   to,
//   movedDirection,
//   isSummand,
// }) => {
//   const from = getOtherTerm(to);

//   const fromTerm = equation[`term${from}`]();
//   const toTerm = equation[`term${to}`]();
//   let newFromTerm, newToTerm;

//   const { moved, remaining, fromDirection, toDirection } =
//     getMovedSummandOrSubtrahend({ equation, to, movedDirection, isSummand });

//   const toChildren = isSummand ? getSubtrahends(toTerm) : getSummands(toTerm);

//   if (moved == null) return false;

//   const newToChildren =
//     fromDirection === toDirection
//       ? [...toChildren, moved]
//       : [moved, ...toChildren];

//   if (isSummand) {
//     newFromTerm = setSummands(fromTerm, remaining, fromDirection);
//     newToTerm = setSubtrahends(toTerm, newToChildren, toDirection);
//   } else {
//     newFromTerm = setSubtrahends(fromTerm, remaining, fromDirection);
//     newToTerm = setSummands(toTerm, newToChildren, toDirection);
//   }

//   equation[`setTerm${from}`](newFromTerm);
//   equation[`setTerm${to}`](newToTerm);

//   return true;
// };

// export const getMovedSummand = ({ equation, to, movedDirection }) =>
//   getMovedSummandOrSubtrahend({
//     equation,
//     to,
//     movedDirection,
//     isSummand: true,
//   });

// export const getMovedSubtrahend = ({ equation, to, movedDirection }) =>
//   getMovedSummandOrSubtrahend({
//     equation,
//     to,
//     movedDirection,
//     isSummand: false,
//   });

// export const moveSummand = ({ expression: equation, to, movedDirection }) =>
//   moveSummandOrSubtrahend({ equation, to, movedDirection, isSummand: true });

// export const moveSubtrahend = ({ expression: equation, to, movedDirection }) =>
//   moveSummandOrSubtrahend({ equation, to, movedDirection, isSummand: false });

// moveFactor, moveDivisor //////////////////////////////////////////////////////////////////////////////

// export const getMovedFactor = ({ equation, to, movedDirection }) => {
//   if (equation.type() !== "GEquation") return {}; // Must be Equation

//   const from = getOtherTerm(to);

//   const fromTerm = equation[`term${from}`]();
//   if (fromTerm.type() === "GProduct1D") {
//     const startDirection = fromTerm.startDirection();
//     const moved = fromTerm.simpleFactor();
//     return { moved, type: "1D", startDirection };
//   } else if (fromTerm.type() === "GProduct2D") {
//     const remaining = movedDirection === "X" ? "Y" : "X";
//     const divisorEdge = fromTerm[`factor${movedDirection}Edge`]();
//     const resultEdge = fromTerm[`factor${remaining}Edge`]();
//     const moved = fromTerm[`factor${movedDirection}`]();
//     return { moved, type: "2D", divisorEdge, resultEdge, remaining };
//   }
//   return {};
// };

// export const moveFactor = ({ expression: equation, to, movedDirection }) => {
//   const from = getOtherTerm(to);
//   const { moved, type, ...props } = getMovedFactor({
//     equation,
//     to,
//     movedDirection,
//   });

//   const toTerm = equation[`term${to}`]();
//   const fromTerm = equation[`term${from}`]();

//   let newFromTerm, newToTerm;

//   if (!moved) return false;
//   if (type === "1D") {
//     moved.setParent(null, null);
//     const { startDirection } = props;

//     newFromTerm = fromTerm.complexFactor();
//     newToTerm = new GQuotient1D({
//       startDirection,
//       complexDivident: toTerm,
//       simpleDivisor: moved,
//     });
//   } /* type === "2D" */ else {
//     const { divisorEdge, resultEdge, remaining } = props;
//     moved.setParent(null, null);

//     newFromTerm = fromTerm[`factor${remaining}`]();
//     newToTerm = new GQuotient2D({
//       divisorEdge,
//       resultEdge,
//       divident: toTerm,
//       divisor: moved,
//     });
//   }
//   equation[`setTerm${from}`](newFromTerm);
//   equation[`setTerm${to}`](newToTerm);

//   return true;
// };

// export const moveDivisor = ({ expression: equation, to }) => {
//   if (equation.type() !== "GEquation") return false; // Must be Equation

//   const from = getOtherTerm(to);

//   const fromTerm = equation[`term${from}`]();
//   const toTerm = equation[`term${to}`]();

//   let newFromTerm, newToTerm;
//   if (fromTerm.type() === "GQuotient1D") {
//     const startDirection = fromTerm.startDirection();
//     const moved = fromTerm.simpleDivisor();
//     moved.setParent(null, null);

//     newFromTerm = fromTerm.complexDivident();
//     newToTerm = new GProduct1D({
//       startDirection,
//       complexFactor: toTerm,
//       simpleFactor: moved,
//     });
//   } else if (fromTerm.type() === "GQuotient2D") {
//     const isMovedX = ["top", "bottom"].includes(fromTerm.divisorEdge());
//     const [factorXEdge, factorYEdge] = isMovedX
//       ? [fromTerm.divisorEdge(), fromTerm.resultEdge()]
//       : [fromTerm.resultEdge(), fromTerm.divisorEdge()];
//     const moved = fromTerm.divisor();
//     moved.setParent(null, null);

//     newFromTerm = fromTerm.divident();
//     newToTerm = new GProduct2D({
//       factorXEdge,
//       factorYEdge,
//       factorX: isMovedX ? moved : toTerm,
//       factorY: isMovedX ? toTerm : moved,
//     });
//   } else {
//     return false;
//   }

//   equation[`setTerm${from}`](newFromTerm);
//   equation[`setTerm${to}`](newToTerm);

//   return true;
// };
// general utils ///////////////////////////////////////////////////////////////////



/////////////////////////////////////////////////////////////////////////////////////////
// moveSummand, moveSubtrahend ////////////////////////////////////////////////////
