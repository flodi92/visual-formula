import Expression from "../expression/Expression";
import getExpressionFromJSON from "./getExpressionFromJSON";
import getJSONFromExpression from "./getJSONFromExpression";


function cloneExpression<TExpression extends Expression>(expression: TExpression) {
    const json = getJSONFromExpression(expression);

    const copy = getExpressionFromJSON(json, { isAddRoot: false, isAdoptIDs: false, isSetUnsetIDs: true });

    return copy as TExpression;
}

export default cloneExpression;