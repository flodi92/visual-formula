import { GExpression } from ".";
import { MExpression } from "../mExpression";
import { Direction, ID, XDirection, YDirection } from "../../types";

export interface ExpressionI {
    id?: ID;
}

export interface GAbstractDirectedExpressionI extends ExpressionI {
    startDirection?: Direction
}

export interface GSumI extends GAbstractDirectedExpressionI {
    gSummands?: GExpression[];
}

export interface GDifferenceI extends GAbstractDirectedExpressionI {
    gMinuend?: GExpression;
    gSubtrahend?: GExpression;
}

export interface GProduct2DI extends ExpressionI {
    gFactorX?: GExpression;
    gFactorY?: GExpression;
    xEdge?: Direction;
    yEdge?: Direction;
}

export interface GProduct1DI extends GAbstractDirectedExpressionI {
    gComplexFactor?: GExpression;
    gSimpleFactor?: GExpression;
}

export interface GQuotient2DI extends ExpressionI {
    gDivident?: GExpression;
    gDivisor?: GExpression;
    divisorEdge?: Direction;
    resultEdge?: Direction;
}

export interface GQuotient1DI extends GAbstractDirectedExpressionI {
    gComplexDivident?: GExpression;
    gSimpleDivisor?: GExpression;
}

export interface GEquationI extends ExpressionI {
    gTerm1?: GExpression;
    gTerm2?: GExpression;
}

export interface GTermI extends ExpressionI {
    gTerm?: GExpression;
}

export interface GAbstractValueI extends ExpressionI {
    numericValue?: number;
    unscaledWidth?: number;
    unscaledHeight?: number;
}

export interface GValueI extends GAbstractValueI {
    mValue?: MExpression;
    xEdge?: YDirection;
    yEdge?: XDirection;
}

export interface GSimpleValueI extends GAbstractValueI {
    mSimpleValue?: MExpression;
    edge?: Direction;
}