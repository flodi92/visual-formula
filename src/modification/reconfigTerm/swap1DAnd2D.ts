import { GExpression, GProduct1D, GProduct2D, GQuotient1D, GQuotient2D, GSimpleValue, GValue } from "../../expression/gExpression";
import { Direction, ID } from "../../types";
import { directionToXY, getOtherXY, oppositeDirection } from "../../utils/general";
import { find, replace } from "../../utils/expression";
import { getXNeighbours, getYNeighbours, isNormableToXY } from "../../utils/gExpression";

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
