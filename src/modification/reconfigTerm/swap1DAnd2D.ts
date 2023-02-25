import { GExpression, GProduct1D, GProduct2D, GQuotient1D, GQuotient2D, GSimpleValue, GValue } from "../../expression/gExpression";
import { Direction, ID, GTypeInParent, YDirection, XDirection } from "../../types";
import { directionToXY, oppositeDirection } from "../../utils/general";
import { find, replace } from "../../utils/expression";
import { getXNeighbours, getYNeighbours, isNormableToXY } from "../../utils/gExpression";
import Expression from "../../expression/Expression";
import Modification from "../Modification";

export interface Swap1DAnd2D extends Modification {
  type?: "swap1DAnd2D",
  ids?: [ID, ID],
  id?: undefined
}
export interface MultiSwap1DAnd2D extends Modification {
  type?: "swap1DAnd2D",
  id?: ID
  ids?: undefined,
}

export const swap1DAnd2D = (expression: GExpression,
  { id, ids }: Swap1DAnd2D | MultiSwap1DAnd2D) => {

  if (id === undefined && ids === undefined) return false;

  const _ids = ((ids !== undefined) ? ids : [id]);

  const terms = _ids.map(id => find(id, expression)).filter(term => !!term) as [Expression, Expression?];

  let commonEdgeChildren: GTypeInParent[] | undefined;
  if (terms.length === 2 && terms.every(term => term instanceof GProduct1D || term instanceof GQuotient1D)) {
    const [term1, term2] = terms as [GProduct1D | GQuotient1D, GProduct1D | GQuotient1D];

    for (let idx = 0; idx < 2; idx++) {
      const child1 = term1.children[idx];
      for (let idx = 0; idx < 2; idx++) {
        const child2 = term2.children[idx];

        if ((child1 instanceof GExpression && child2 instanceof GExpression)
          && (child1.numericValue !== undefined && child1.numericValue === child2.numericValue)
        ) {
          commonEdgeChildren = [child1?.typeInParent, child2?.typeInParent] as GTypeInParent[];
        }
      }
    }

    if (!commonEdgeChildren?.length) return false;
  }

  for (let idx = 0; idx < terms.length; idx++) {
    const term = terms[idx];
    const commonEdgeChild = commonEdgeChildren?.length == 2 ? commonEdgeChildren[idx] : undefined;

    if (!term || !(term.parent instanceof GExpression)) return false;

    const isParentNormed = term.parent?.isNormX || term.parent?.isNormY;

    let newTerm;
    if (term instanceof GProduct1D && !isParentNormed) {
      const canComplexXNorm = isNormableToXY(term.gComplexFactor, "X");
      const canComplexYNorm = isNormableToXY(term.gComplexFactor, "Y");

      type gFactorT = 'gFactorX' | 'gFactorY' | undefined;
      let factorFromComplex: gFactorT;
      let factorFromSimple: gFactorT;

      if (!!commonEdgeChild) {

        [factorFromComplex, factorFromSimple] =
          (
            (canComplexXNorm &&
              (
                (commonEdgeChild === "gComplexFactor" && directionToXY(term.startDirection) === 'X')
                || (commonEdgeChild === "gSimpleFactor" && directionToXY(term.startDirection) === 'Y')
              )
            )
              ? ["gFactorY", "gFactorX"]
              : (canComplexYNorm &&
                (
                  (commonEdgeChild === "gComplexFactor" && directionToXY(term.startDirection) === 'Y')
                  || (commonEdgeChild === "gSimpleFactor" && directionToXY(term.startDirection) === 'X')
                )
              )
                ? ["gFactorX", "gFactorY"]
                : []) as [gFactorT, gFactorT];
      } else {
        [factorFromComplex, factorFromSimple] =
          (canComplexXNorm
            ? ["gFactorY", "gFactorX"]
            : canComplexYNorm
              ? ["gFactorX", "gFactorY"]
              : []) as ['gFactorX' | 'gFactorY', 'gFactorX' | 'gFactorY'];
      }

      const [xEdge, yEdge] = (idx === 0 ? ['top', 'left'] : ['bottom', 'right']) as [Direction, Direction];

      if (!factorFromComplex && !factorFromSimple) return false; // gComplexFactor can neither be normed to x nor to y

      if (
        getXNeighbours(term).some(value => value.isNormX) ||
        getYNeighbours(term).some(value => value.isNormY) ||
        !factorFromComplex ||
        !factorFromSimple
      )
        return false;

      newTerm = new GProduct2D({
        id: term.id,
        xEdge,
        yEdge,
        [factorFromComplex]: term.gComplexFactor,
        [factorFromSimple]: new GValue(
          {
            id: term.gSimpleFactor?.id,
            numericValue: term.gSimpleFactor?.numericValue,
            mValue: term.gSimpleFactor?.mSimpleValue,
            xEdge: oppositeDirection(xEdge) as YDirection,
            yEdge: oppositeDirection(yEdge) as XDirection,
          }
        ),
      });

    } else if (term instanceof GQuotient1D && !isParentNormed) {
      const canComplexXNorm = isNormableToXY(term.gComplexDivident, "X");
      const canComplexYNorm = isNormableToXY(term.gComplexDivident, "Y");

      let divisorEdge: Direction | undefined;
      let resultEdge: Direction | undefined;

      if (!!commonEdgeChild) {
        [divisorEdge, resultEdge] =
          canComplexXNorm && (
            (commonEdgeChild === "gComplexDivident" && directionToXY(term.startDirection) === 'X')
            || (commonEdgeChild === "gSimpleDivisor" && directionToXY(term.startDirection) === 'Y')
          )
            ? ["left", "top"]
            : canComplexYNorm && (
              (commonEdgeChild === "gComplexDivident" && directionToXY(term.startDirection) === 'Y')
              || (commonEdgeChild === "gSimpleDivisor" && directionToXY(term.startDirection) === 'X')
            )
              ? ["top", "left"]
              : []

      } else {
        [divisorEdge, resultEdge] =
          canComplexXNorm
            ? ["left", "top"]
            : canComplexYNorm
              ? ["top", "left"]
              : []
      }

      [divisorEdge, resultEdge] = [divisorEdge, resultEdge].map(
        direction => idx === 1 ? oppositeDirection(direction as Direction | undefined) : direction
      ) as [Direction, Direction];

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
    } else if (term instanceof GProduct2D) { // TODO common edge children?
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
    } else if (term instanceof GQuotient2D) { // TODO common edge children?
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

    replace(newTerm.id as ID, expression, newTerm as GExpression);

  }
  return true;
}