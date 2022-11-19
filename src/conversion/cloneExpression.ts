import { cloneDeep, zip } from "lodash";
import Expression from "../expression/Expression";
import { expressionToArray } from "../utils/expression";

const cloneExpression = (expression: Expression): Expression => {
    const _removeParents = (expression: Expression) => expressionToArray(expression)
        .forEach(expression => expression._setParent(undefined, undefined))

    const _addParents = (expression: Expression) => expressionToArray(expression)
        .forEach(expression =>
            zip(expression.children, expression.childrenTypesInParent).forEach(
                ([child, typeInParent]) => (child?._setParent(expression, typeInParent))
            )
        )

    _removeParents(expression);
    const buffer: Expression = cloneDeep(expression);
    _addParents(expression);
    _addParents(buffer);

    return buffer;
}

export default cloneExpression;