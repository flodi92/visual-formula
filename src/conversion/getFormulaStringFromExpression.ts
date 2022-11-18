import Expression from "../expression/Expression";
import getJSONFromExpression from "./getJSONFromExpression";
import getMExpressionFromExpression from "./getMExpressionFromExpression";

const getFormulaStringFromExpression =
    (expression?: Expression) =>
        <string | undefined>getJSONFromExpression(getMExpressionFromExpression(expression));

export default getFormulaStringFromExpression;