import { GAbstractRoot, GSum } from "../../expression/gExpression";
import { find } from "../../utils/expression";
import Modification from "../Modification";

export interface SwapSummands extends Modification {
  type?: "swapSummands",
  indexA: number,
  indexB: number,
}

export const swapSummands = (expression: GAbstractRoot, { id, indexA, indexB, }: SwapSummands) => {
  const sum = find(id, expression);

  if (!sum || !(sum instanceof GSum)) return false;
  const gSummands = sum.gSummands;
  const gSummandA = gSummands && gSummands[indexA];
  const gSummandB = gSummands && gSummands[indexB];

  if (!gSummandA || !gSummandB) return false;
  gSummands[indexA] = gSummandB;
  gSummands[indexB] = gSummandA;
  sum.gSummands = gSummands;

  return true;
};

