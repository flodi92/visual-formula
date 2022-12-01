import { GDifference, GExpression, GSum } from "../../expression/gExpression";
import { Direction } from "../../types";
import { isParallel, oppositeDirection } from "../general";

export const getSummands = (gExpression?: GExpression, expectedDirection?: Direction): GExpression[] =>
  !gExpression
    ? []
    : gExpression instanceof GSum &&
      (!expectedDirection || isParallel(gExpression.startDirection, expectedDirection))
      ? (gExpression.gSummands || [])
      : gExpression instanceof GDifference &&
        (!expectedDirection || isParallel(gExpression.startDirection, expectedDirection))
        ? getSummands(gExpression.gMinuend, gExpression.startDirection)
        : [gExpression];

export const setSummands =
  (gExpression?: GExpression, gSummands: GExpression[] = [], startDirection?: Direction) => {
    if (!gSummands?.length && gExpression instanceof GDifference) {
      return undefined;
    } else if (!gExpression || !(gExpression instanceof GSum || gExpression instanceof GDifference)) {

      if (gSummands?.length === 1) return gSummands[0];
      else {
        const gSum = new GSum();
        [gSum.gSummands, gSum.startDirection] = [gSummands, startDirection];
        return gSum
      }

    } else if (gExpression instanceof GSum) {

      if (gSummands?.length === 1) return gSummands[0];
      else { gExpression.gSummands = gSummands; }

    } else if (gExpression instanceof GDifference) {

      gExpression.gMinuend = setSummands(gExpression.gMinuend, gSummands, startDirection);
      if (!gExpression.gMinuend) return gExpression.gSubtrahend;

    }
    return gExpression;
  };

export const getSubtrahends = (gExpression?: GExpression, expectedDirection?: Direction) => {
  return gExpression instanceof GDifference &&
    (!expectedDirection || isParallel(gExpression.startDirection, expectedDirection))
    ? getSummands(gExpression.gSubtrahend, gExpression.startDirection)
    : [];
};

export const setSubtrahends = (
  gExpression?: GExpression, gSubtrahends: GExpression[] = [], startDirection?: Direction
) => {
  if (!gExpression || !(gExpression instanceof GDifference)) {
    const gMinuend = gExpression;
    const gSubtrahend = setSummands(undefined, gSubtrahends, startDirection);

    if (!!gMinuend || !!gSubtrahend) {
      const gDifference = new GDifference();
      [gDifference.gMinuend, gDifference.gSubtrahend, gDifference.startDirection]
        = [gMinuend, gSubtrahend, oppositeDirection(startDirection)];
      return gDifference
    } else return undefined;

  } else {

    if (!!gSubtrahends.length) {
      gExpression.gSubtrahend = setSummands(gExpression.gSubtrahend, gSubtrahends, startDirection);
    } else return gExpression.gMinuend;

  }
  return gExpression;
};

export const sumStartDirection = (gExpression?: GExpression): Direction | undefined =>
  !gExpression
    ? undefined
    : gExpression instanceof GSum
      ? gExpression.startDirection
      : gExpression instanceof GDifference
        ? sumStartDirection(<GDifference>gExpression.gMinuend) || gExpression.startDirection
        : undefined;

export const differenceStartDirection = (gExpression?: GExpression) =>
  !gExpression
    ? undefined
    : gExpression instanceof GDifference
      ? gExpression.startDirection
      : undefined;