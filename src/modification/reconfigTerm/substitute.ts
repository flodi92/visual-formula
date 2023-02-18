import { GAbstractValue, GExpression, GProduct1D, GProduct2D, GSimpleValue, GValue } from "../../expression/gExpression";
import { ID } from "../../types";
import { getMExpressionFromExpression } from "../../conversion";
import { find, replace } from "../../utils/expression";
import { directionToXY } from "../../utils/general";

export const substitute = (expression: GExpression,
  { ids, id }: { ids: [ID, ID], id?: undefined } | { id: ID, ids?: undefined }): boolean => {

  if (id !== undefined) {
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
  }
  if (ids !== undefined) { // TODO extract to some other function reassociate + other cases
    const term1 = find(ids[0], expression);
    const term2 = find(ids[1], expression);

    const [factorFromComplex, otherFactor] = term1.typeInParent === "gComplexFactor" ? [term1, term2]
      : term2.typeInParent === "gComplexFactor" ? [term2, term1] : []

    if (otherFactor?.parent instanceof GProduct2D && otherFactor.parent === factorFromComplex?.parent?.parent) {
      const product2d = otherFactor?.parent as GProduct2D;
      const product1d = factorFromComplex.parent as GProduct1D;
      if (!product2d?.id || !product1d?.id) return false;

      const [_factorFromOther, _factorFromComplex] = (otherFactor.typeInParent === "gFactorX" ?
        ['gFactorX', 'gFactorY'] :
        ['gFactorY', 'gFactorX']) as ['gFactorY' | 'gFactorX', 'gFactorY' | 'gFactorX'];

      const replacedTerm = new GProduct1D({
        id: product2d.id,
        gSimpleFactor: product1d.gSimpleFactor,
        gComplexFactor: new GProduct2D(
          {
            id: product1d.id,
            [_factorFromOther]: otherFactor,
            [_factorFromComplex]: factorFromComplex,
            xEdge: product2d.xEdge,
            yEdge: product2d.yEdge,
          }),
        startDirection: product1d.startDirection,
      });

      if (directionToXY(product1d.startDirection) === "X")
        (replacedTerm.gSimpleFactor as GSimpleValue).unscaledHeight = replacedTerm.gComplexFactor?.unscaledHeight;
      else
        (replacedTerm.gSimpleFactor as GSimpleValue).unscaledWidth = replacedTerm.gComplexFactor?.unscaledWidth;

      replace(product2d.id, expression, replacedTerm);
      return substitute(expression, { id: product1d.id });
    }
  }

  return false;
};
