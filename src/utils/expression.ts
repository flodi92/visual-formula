import { ID, } from "../types";
import Expression from "../expression/Expression";
import { GAbstractRoot, GDifference, GEquation, GExpression, GProduct1D, GProduct2D, GQuotient1D, GQuotient2D, GSimpleValue, GSum, GTerm, GValue } from "../expression/gExpression";

export function find<TExpression extends Expression>(id: ID | undefined, expression: TExpression): Expression {
    if (id === undefined) {
        return expression;
    }
    if (expression.id === id) {
        return expression;
    } else {
        return (expression.children
            .map(child => child && find(id, child))
            .find(expression => !!expression)) as Expression
    }
}

export function replace<TExpression extends Expression>(id: ID, expression: TExpression, replacementTerm: Expression) {
    const replacedTerm = find(id, expression);
    if (!replacedTerm) return;
    const parent = replacedTerm.parent;
    if (!parent) return replacementTerm;

    if (replacementTerm instanceof GExpression) {
        if (replacedTerm.typeInParent === "gSummand") {
            const children = (parent as GSum).gSummands;
            const idx = children?.findIndex((child) => child.id === id);
            children !== undefined && idx !== undefined && children.splice(idx, 1, replacementTerm);
            (parent as GSum).gSummands = children;
        } else if (replacedTerm.typeInParent === "gMinuend") {
            (parent as GDifference).gMinuend = replacementTerm;
        } else if (replacedTerm.typeInParent === "gSubtrahend") {
            (parent as GDifference).gSubtrahend = replacementTerm;
        } else if (replacedTerm.typeInParent === "gFactorX") {
            (parent as GProduct2D).gFactorX = replacementTerm;
        } else if (replacedTerm.typeInParent === "gFactorY") {
            (parent as GProduct2D).gFactorY = replacementTerm;
        } else if (replacedTerm.typeInParent === "gComplexFactor") {
            (parent as GProduct1D).gComplexFactor = replacementTerm;
        } else if (replacedTerm.typeInParent === "gSimpleFactor"
            && replacementTerm instanceof GSimpleValue) {
            (parent as GProduct1D).gSimpleFactor = replacementTerm;
        } else if (replacedTerm.typeInParent === "gDivident") {
            (parent as GQuotient2D).gDivident = replacementTerm;
        } else if (replacedTerm.typeInParent === "gDivisor") {
            (parent as GQuotient2D).gDivisor = replacementTerm;
        } else if (replacedTerm.typeInParent === "gComplexDivident") {
            (parent as GQuotient1D).gComplexDivident = replacementTerm;
        } else if (replacedTerm.typeInParent === "gSimpleDivisor"
            && replacementTerm instanceof GSimpleValue) {
            (parent as GQuotient1D).gSimpleDivisor = replacementTerm;
        } else if (replacedTerm.typeInParent === "gTerm1") {
            (parent as GEquation).gTerm1 = replacementTerm;
        } else if (replacedTerm.typeInParent === "gTerm2") {
            (parent as GEquation).gTerm2 = replacementTerm;
        } else if (replacedTerm.typeInParent === "gTerm") {
            (parent as GTerm).gTerm = replacementTerm;
        }
    } else { // replacementTerm instanceof MExpression
        if (replacedTerm.typeInParent === "mValue") {
            (parent as GValue).mValue = replacementTerm;
        } else if (replacedTerm.typeInParent === "mSimpleValue") {
            (parent as GSimpleValue).mSimpleValue = replacementTerm;
        }
        return expression;
    };
}

export const compareExpressions = (a?: Expression, b?: Expression): boolean => {
    const [_a, _b] = [!!a ? { ...a } : {}, !!b ? { ...b } : {}] as [any, any];

    return Array.from((new Set(...Object.keys(_a), ...Object.keys(_b))))
        .filter(key => key !== "id")
        .every(
            (key: string) => (_a[key] instanceof Expression) ?
                compareExpressions(_a[key], _b[key]) :
                _a[key] === _b[key]
        );
}

export const expressionToArray = (expression: Expression): Expression[] => [expression,
    ...expression.children
        .filter(child => !!child)
        .reduce(
            (prev, child) => ([...prev, ...expressionToArray(child as Expression)]),
            [] as Expression[])];

export const getRoot = (expression: Expression): GAbstractRoot =>
    !!expression.parent ? getRoot(expression.parent) : <GAbstractRoot>expression;

export const getMaxID = (expression: Expression) => Math.max(
    0, ...expressionToArray(expression).map(({ id }) => id).filter(id => !!id) as number[]
);

export const setUnsetIDs = (expression?: Expression) => {
    if (!expression) return;
    let idCounter = getMaxID(expression) + 1;
    expressionToArray(expression).forEach(expression => !expression.id && (expression.id = idCounter++))
}