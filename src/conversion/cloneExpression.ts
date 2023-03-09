import Expression from "../expression/Expression";
import { GAbstractRoot } from "../expression/gExpression";
import getExpressionFromJSON from "./getExpressionFromJSON";
import getJSONFromExpression from "./getJSONFromExpression";


function cloneExpression<TExpression extends Expression>(expression: TExpression,
    { isAddRoot = false, isAdoptIDs = false, isSetUnsetIDs = false }:
        { isAddRoot?: boolean, isAdoptIDs?: boolean, isSetUnsetIDs?: boolean } = {}) {
    const json = getJSONFromExpression(expression);

    const copy = getExpressionFromJSON(json, { isAddRoot, isAdoptIDs, isSetUnsetIDs });

    if (expression instanceof GAbstractRoot && copy instanceof GAbstractRoot) {
        copy.layerTransformation = expression.layerTransformation
    }


    return copy as TExpression;
}

export default cloneExpression;