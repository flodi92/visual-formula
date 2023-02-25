import Modification from "../Modification";
import { autoConfigSize } from "../../autoAdapt";
import { find } from "../../utils/expression";
import { directionToXY } from "../../utils/general";
import { GExpression, GProduct1D, GSimpleValue, GValue } from "../../expression/gExpression";

export interface SwapFactors1D extends Modification { type?: "swapFactors1D" }

export const swapFactors1D = (expression: GExpression, { id }: SwapFactors1D = {}) => {
  const term = find(id, expression);

  if (term instanceof GProduct1D) {
    const gComplexFactor = term.gComplexFactor;
    const gSimpleFactor = term.gSimpleFactor;
    if (!gComplexFactor || !gSimpleFactor ||
      !(gComplexFactor instanceof GValue) ||
      !(gSimpleFactor instanceof GSimpleValue)
    )
      return false;

    [gSimpleFactor.mSimpleValue, gComplexFactor.mValue]
      = [gComplexFactor.mValue, gSimpleFactor.mSimpleValue];

    [gSimpleFactor.numericValue, gComplexFactor.numericValue]
      = [gComplexFactor.numericValue, gSimpleFactor.numericValue];

    if (directionToXY(term.startDirection) === 'X') {
      gComplexFactor.unscaledWidth = undefined;
      gSimpleFactor.unscaledWidth = undefined;
    }
    else { //if(directionToXY(term.startDirection) === 'X')
      gComplexFactor.unscaledHeight = undefined;
      gSimpleFactor.unscaledHeight = undefined;
    }

    autoConfigSize(expression);
  } //Would be mathmatically incorrect for GQuotient1D
  else return false;
  return true;
};