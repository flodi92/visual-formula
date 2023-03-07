import { InteractionProps } from "../draw/AbstractDraw";
import { M_COLOR_1, M_COLOR_2 } from "../draw/config";
import { MDifference, MEquation, MExpression, MProduct, MQuotient, MSum, MValue } from "../expression/mExpression";
import { handlersOfId, interactionStyle } from "./drawUtils";

import './DrawMValue.css';

const DrawMExpression = ({ mExpression, interactionProps }: ({ mExpression?: MExpression, interactionProps: InteractionProps })): JSX.Element => {
    if (!mExpression) return <></>


    const props = {
        style: {
            color: mExpression.isTerm1 ? M_COLOR_1 : M_COLOR_2,
            ...interactionStyle(mExpression, interactionProps),
        },
        ...handlersOfId(mExpression?.id, interactionProps)
    }

    if (mExpression instanceof MValue) {
        return (
            mExpression.isConstant ?
                // @ts-ignore    
                <mi{...props}>{(mExpression.mValue)}</mi>
                // @ts-ignore    
                : <mn{...props}>{(mExpression.mValue)}</mn>
        );
    } else if (mExpression instanceof MSum) {
        return <>{(
            mExpression?.mSummands?.map((mSummand, idx, { length }) => (
                <>
                    <DrawMExpression mExpression={mSummand} {...{ interactionProps }} />
                    {/* @ts-ignore */}
                    {idx < length - 1 && <mo {...props}>+</mo>}
                </>))
        )}</>;
    } else if (mExpression instanceof MDifference) {
        return (
            <>
                <DrawMExpression mExpression={mExpression.mMinuend} {...{ interactionProps }} />
                {/* @ts-ignore */}
                <mo {...props}>&minus;</mo>
                <DrawMExpression mExpression={mExpression.mSubtrahend} {...{ interactionProps }} />
            </>
        );
    } else if (mExpression instanceof MProduct) {
        return <> {mExpression?.mFactors?.map((mFactor, idx, { length }) => {
            const isBracket: boolean = !(mFactor instanceof MValue);
            return (
                <>
                    {/* @ts-ignore */}
                    {isBracket && <mo {...props}>(</mo>}
                    <DrawMExpression mExpression={mFactor} {...{ interactionProps }} />
                    {/* @ts-ignore */}
                    {isBracket && <mo {...props}>)</mo>}
                    {/* @ts-ignore */}
                    {idx < length - 1 && <mo {...props}>&times;</mo>}
                </>
            );
        })}</>;
    } else if (mExpression instanceof MQuotient) {
        {/* TODO brackets */ }
        return (
            // @ts-ignore
            <mfrac {...props}>
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
                <DrawMExpression mExpression={mExpression.mTerm1} {...{ interactionProps }} />
                {/* @ts-ignore */}
                <mo>=</mo>
                <DrawMExpression mExpression={mExpression.mTerm2} {...{ interactionProps }} />
            </>
        )
    }
    return <></>;
}

const DrawMValue = ({ mExpression, interactionProps }
    : { mExpression?: MExpression, interactionProps?: InteractionProps }): JSX.Element => {

    const style = {
        fontFamily: "sans-serif",
        fontWeight: "bold",
    }

    return (
        // @ts-ignore    
        <math {...style}>
            <DrawMExpression {...{
                mExpression, interactionProps: interactionProps || {
                    onClickID() { },
                    onEnterID() { },
                    onLeaveID() { },
                    onMouseDownID() { },
                }
            }} />
            {/* @ts-ignore     */}
        </math>)
}

export default DrawMValue;