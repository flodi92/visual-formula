import { ExpressionI } from "../Expression";
import MExpression from "./MExpression"

export interface MSumI extends ExpressionI {
    mSummands?: MExpression[];
}

export interface MDifferenceI extends ExpressionI {
    mMinuend?: MExpression;
    mSubtrahend?: MExpression;
}

export interface MProductI extends ExpressionI {
    mFactors?: MExpression[];
}

export interface MQuotientI extends ExpressionI {
    mDivident?: MExpression;
    mDivisor?: MExpression;
}

export interface MEquationI extends ExpressionI {
    mTerm1?: MExpression;
    mTerm2?: MExpression;
}

export interface MValueI extends ExpressionI {
    mValue?: string;
}