import { GAbstractRoot, GProduct2D } from "../../expression/gExpression";
import Modification from "../Modification";
import { find } from "../../utils/expression";
import { isClockwise } from "../../utils/general";
import { reverse, rotate } from "../reconfigTerm";

export interface SwapFactors2D extends Modification { type?: "swapFactors2D" }

export const swapFactors2D = (expression: GAbstractRoot, { id }: SwapFactors2D = {}) => {
  const term = find(id, expression);
  if (!(term instanceof GProduct2D)) return false;

  let { gFactorX, gFactorY, xEdge, yEdge } = term;
  if (!gFactorX || !gFactorY) return false;

  let success = true;

  success = success && reverse(gFactorX, { xy: "X" });
  success = success && reverse(gFactorY, { xy: "Y" });

  success = success && rotate(gFactorX, {
    isClockwise: isClockwise(yEdge, xEdge),
  });
  success = success && rotate(gFactorY, {
    isClockwise: isClockwise(xEdge, yEdge),
  });

  if (!success) return false;

  [term.gFactorX, term.gFactorY] = [gFactorY, gFactorX]

  return true;
};