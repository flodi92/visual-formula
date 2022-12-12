import { ExpressionI } from "../Expression";
import MExpression from "./MExpression"

export interface MSumI extends ExpressionI {
    mSummands: MExpression[] | undefined;
}

export interface MDifferenceI extends ExpressionI {
    mMinuend: MExpression | undefined;
    mSubtrahend: MExpression | undefined;
}

export interface MProductI extends ExpressionI {
    mFactors: MExpression[] | undefined;
}

export interface MQuotientI extends ExpressionI {
    mDivident: MExpression | undefined;
    mDivisor: MExpression | undefined;
}

export interface MEquationI extends ExpressionI {
    mTerm1: MExpression | undefined;
    mTerm2: MExpression | undefined;
}

export interface MValueI extends ExpressionI {
    mValue: string | undefined;
}