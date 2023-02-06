import { ReactNode } from "react";
import { MDifference, MEquation, MExpression, MProduct, MQuotient, MSum, MValue } from "../expression/mExpression";

const DrawMValue = (mExpression?: MExpression): ReactNode => {
    if (!mExpression) return <></>

    let buffer;
    if (mExpression instanceof MValue) {
        buffer = (
            mExpression.isConstant ?
                // @ts-ignore    
                <mi>{(mExpression.mValue)}</mi>
                // @ts-ignore    
                : <mn>{(mExpression.mValue)}</mn>
        );
    } else if (mExpression instanceof MSum) {
        buffer = (
            mExpression?.mSummands?.map((mSummand, idx, { length }) => (
                <>
                    {DrawMValue(mSummand)}
                    {/* @ts-ignore */}
                    {idx < length - 1 && <mo>+</mo>}
                </>))
        );
    } else if (mExpression instanceof MDifference) {
        buffer = (
            <>
                {DrawMValue(mExpression.mMinuend)}
                {/* @ts-ignore */}
                <mo>&minus;</mo>
                {DrawMValue(mExpression.mSubtrahend)}
            </>
        );
    } else if (mExpression instanceof MProduct) {
        buffer = mExpression?.mFactors?.map((mFactor, idx, { length }) => {
            const isBracket: boolean = !(mFactor instanceof MValue);
            return (
                <>
                    {/* @ts-ignore */}
                    {isBracket && <mo>(</mo>}
                    {DrawMValue(mFactor)}
                    {/* @ts-ignore */}
                    {isBracket && <mo>)</mo>}
                    {/* @ts-ignore */}
                    {idx < length - 1 && <mo>&times;</mo>}
                </>
            );
        });
    } else if (mExpression instanceof MQuotient) {
        {/* TODO brackets */ }
        buffer = (
            // @ts-ignore
            <mfrac>
                {/* @ts-ignore */}
                <mrow> {DrawMValue(mExpression.mDivident)} </mrow>
                {/* @ts-ignore */}
                <mrow> {DrawMValue(mExpression.mDivisor)} </mrow>
                {/* @ts-ignore */}
            </mfrac>
        );
    } else if (mExpression instanceof MEquation) {
        buffer = (
            <>
                {DrawMValue(mExpression.mTerm1)}
                {/* @ts-ignore */}
                <mo>=</mo>
                {DrawMValue(mExpression.mTerm2)}
            </>
        )
    }
    return buffer;
}

export default DrawMValue;