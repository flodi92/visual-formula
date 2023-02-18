import { MDifference, MEquation, MExpression, MProduct, MQuotient, MSum, MValue } from "../expression/mExpression";

const DrawMExpression = ({ mExpression }: { mExpression?: MExpression }): JSX.Element => {
    if (!mExpression) return <></>

    if (mExpression instanceof MValue) {
        return (
            mExpression.isConstant ?
                // @ts-ignore    
                <mi>{(mExpression.mValue)}</mi>
                // @ts-ignore    
                : <mn>{(mExpression.mValue)}</mn>
        );
    } else if (mExpression instanceof MSum) {
        return <>{(
            mExpression?.mSummands?.map((mSummand, idx, { length }) => (
                <>
                    <DrawMExpression mExpression={mSummand} />
                    {/* @ts-ignore */}
                    {idx < length - 1 && <mo>+</mo>}
                </>))
        )}</>;
    } else if (mExpression instanceof MDifference) {
        return (
            <>
                <DrawMExpression mExpression={mExpression.mMinuend} />
                {/* @ts-ignore */}
                <mo>&minus;</mo>
                <DrawMExpression mExpression={mExpression.mSubtrahend} />
            </>
        );
    } else if (mExpression instanceof MProduct) {
        return <> {mExpression?.mFactors?.map((mFactor, idx, { length }) => {
            const isBracket: boolean = !(mFactor instanceof MValue);
            return (
                <>
                    {/* @ts-ignore */}
                    {isBracket && <mo>(</mo>}
                    <DrawMExpression mExpression={mFactor} />
                    {/* @ts-ignore */}
                    {isBracket && <mo>)</mo>}
                    {/* @ts-ignore */}
                    {idx < length - 1 && <mo>&times;</mo>}
                </>
            );
        })}</>;
    } else if (mExpression instanceof MQuotient) {
        {/* TODO brackets */ }
        return (
            // @ts-ignore
            <mfrac>
                {/* @ts-ignore */}
                <mrow> <DrawMExpression mExpression={mExpression.mDivident} /> </mrow>
                {/* @ts-ignore */}
                <mrow> <DrawMExpression mExpression={mExpression.mDivisor} /> </mrow>
                {/* @ts-ignore */}
            </mfrac>
        );
    } else if (mExpression instanceof MEquation) {
        return (
            <>
                <DrawMExpression mExpression={mExpression.mTerm1} />
                {/* @ts-ignore */}
                <mo>=</mo>
                <DrawMExpression mExpression={mExpression.mTerm2} />
            </>
        )
    }
    return <></>;
}

const DrawMValue = ({ mExpression }: { mExpression?: MExpression }): JSX.Element => {

    const style = {
        fontFamily: "sans-serif",
        fontWeight: "bold",
    }

    return (
        // @ts-ignore    
        <math {...style}>
            <DrawMExpression {...{ mExpression }} />
            {/* @ts-ignore     */}
        </math>)
}

export default DrawMValue;