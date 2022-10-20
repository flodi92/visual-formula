import { ID, } from "../types";
import Expression from "../expression/Expression";

export function find<TExpression extends Expression>(id: ID, expression: TExpression): TExpression {
    if (expression.id === id) {
        return expression as TExpression;
    } else {
        return (expression.children
            .map(child => child && find(id, child))
            .find(expression => !!expression)) as TExpression
    }
}