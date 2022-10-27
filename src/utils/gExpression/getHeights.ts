import { GExpression } from "../../expression/gExpression";

export default (expressions: GExpression[]) => expressions.map(_expression => _expression?.unscaledHeight || 0) || [];