import { GExpression } from ".";
import { MExpression } from "../mExpression";
import { Direction, ID, XDirection, YDirection } from "../../types";

export interface ExpressionI {
    id: ID | undefined;
}

export interface GAbstractDirectedExpressionI extends ExpressionI {
    startDirection: Direction | undefined
}

export interface GSumI extends GAbstractDirectedExpressionI {
    gSummands: GExpression[] | undefined;
}

export interface GDifferenceI extends GAbstractDirectedExpressionI {
    gMinuend: GExpression | undefined;
    gSubtrahend: GExpression | undefined;
}

export interface GProduct2DI extends ExpressionI {
    gFactorX: GExpression | undefined;
    gFactorY: GExpression | undefined;
}

export interface GProduct1DI extends GAbstractDirectedExpressionI {
    gComplexFactor: GExpression | undefined;
    gSimpleFactor: GExpression | undefined;
}

export interface GQuotient2DI extends ExpressionI {
    gDivident: GExpression | undefined;
    gDivisor: GExpression | undefined;
}

export interface GQuotient1DI extends GAbstractDirectedExpressionI {
    gComplexDivident: GExpression | undefined;
    gSimpleDivisor: GExpression | undefined;
}

export interface GEquationI extends ExpressionI {
    gTerm1: GExpression | undefined;
    gTerm2: GExpression | undefined;
}

export interface GTermI extends ExpressionI {
    gTerm: GExpression | undefined;
}

export interface GAbstractValueI extends ExpressionI {
    numericValue: number | undefined;
    unscaledWidth: number | undefined;
    unscaledHeight: number | undefined;
}

export interface GValueI extends GAbstractValueI {
    mValue: MExpression | undefined;
    xEdge: YDirection | undefined;
    yEdge: XDirection | undefined;
}

export interface GSimpleValueI extends GAbstractValueI {
    mSimpleValue: MExpression | undefined;
    edge: Direction | undefined;
}