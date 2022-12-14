import { GAbstractValue, GExpression, GValue } from "../../expression/gExpression";
import { ID } from "../../types";
import { getMExpressionFromExpression } from "../../conversion";
import { find, replace } from "../../utils/expression";

export const substitute = (expression: GExpression,
  { id }: { id: ID }) => {
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
};
