import Expression from "../../expression/Expression";
import { GAbstractDirectedExpression, GAbstractValue, GEquation, GExpression, GProduct2D, GQuotient2D } from "../../expression/gExpression";
import { XY } from "../../types";
import { expressionToArray } from "../expression";
import { directionToXY, getOtherXY } from "../general";

const isValueNormed = (gaValue: GAbstractValue, xy: XY) => {
    const getHierarchy = (expression: Expression): Expression[] =>
        !!expression.parent ? [expression, ...getHierarchy(expression.parent)] : [expression]

    const hierarchy = getHierarchy(gaValue);

    for (const expression of hierarchy) {
        const parent = expression.parent;
        if (parent instanceof GProduct2D && expression.typeInParent === `gFactor${getOtherXY(xy)}`) {
            return true;
        }
        if (parent instanceof GQuotient2D && directionToXY(parent.divisorEdge) === xy && expression.typeInParent === `gDivisor`) {
            return true;
        }
        if (parent instanceof GEquation) {
            const otherTerm = expression.typeInParent === "gTerm1" ? "gTerm2" : "gTerm1";

            if (parent[otherTerm] instanceof GQuotient2D && directionToXY((parent[otherTerm] as GQuotient2D).resultEdge) === xy) {
                return true;
            }
        }
        if (expression instanceof GAbstractValue) { continue; }
        if (!(expression instanceof GAbstractDirectedExpression) || directionToXY(expression.startDirection) !== xy) {
            return false;
        }
    }
    return false;
}


const getNormedValues = (gRoot: GExpression | undefined, xy: XY): GAbstractValue[] => {
    if (!gRoot) { return []; }

    return (expressionToArray(gRoot)
        .filter(expression => expression instanceof GAbstractValue) as GAbstractValue[])
        .filter(gaValue => isValueNormed(gaValue as GAbstractValue, xy));
}

export const getXNormedValues = (gExpression: GExpression): GAbstractValue[] => {
    return getNormedValues(gExpression, 'X');
}

export const getYNormedValues = (gExpression: GExpression): GAbstractValue[] => {
    return getNormedValues(gExpression, 'Y');
}