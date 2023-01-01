import { GEquation, GExpression } from "../../expression/gExpression";
import { ID } from "../../types";
import { isParallel, oppositeDirection } from "../../utils/general";
import { getSummands, setSummands, getSubtrahends, setSubtrahends, sumStartDirection, differenceStartDirection } from "../../utils/gExpression";

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

    fromDirection = fromDirection || toDirection || "left";
    toDirection = toDirection || fromDirection || "left";
    if (!fromDirection && !toDirection) fromDirection = toDirection = "left";

    if (
      firstFrom.id === id && (oppositeDirection(fromDirection) === toDirection)
    )
      return {
        moved: firstFrom,
        remaining: fromChildren.slice(1, fromChildren.length),
        fromDirection,
        toDirection,
        from,
        fromTerm,
      };
    else if (
      lastFrom.id === id && (fromDirection === toDirection)
    )
      return {
        moved: lastFrom,
        remaining: fromChildren.slice(0, fromChildren.length - 1),
        fromDirection,
        toDirection,
        from,
        fromTerm,
      };
    else { return null; }
  };

  const {
    moved,
    remaining,
    fromDirection,
    toDirection,
    from,
    fromTerm,
  } = testFromTerm(1, 2) || testFromTerm(2, 1) || {};

  if (!moved) return false;

  const to = from && { [1]: 2, [2]: 1 }[from] as 1 | 2 | undefined;
  const toTerm = !!to ? gEquation[`gTerm${to}`] : undefined;
  let toChildren = isSummand ? getSubtrahends(toTerm) : getSummands(toTerm);

  let newToChildren;
  if (isParallel(fromDirection, toDirection)) {
    newToChildren = [moved, ...toChildren];
  } else {
    return false;
  }

  const [newFromTerm, newToTerm] = isSummand ?
    [
      setSummands(fromTerm, remaining, fromDirection),
      setSubtrahends(toTerm, newToChildren, toDirection),
    ] :
    [
      setSubtrahends(fromTerm, remaining, fromDirection),
      setSummands(toTerm, newToChildren, toDirection),
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
