import {
    GExpression,
    GEquation,
    GSum,
    GDifference,
    GProduct1D,
    GProduct2D,
    GQuotient1D,
    GQuotient2D,
    GSimpleValue,
    GTerm,
    GValue,
} from "../expression/gExpression"
import {
    MSum,
    MDifference,
    MProduct,
    MQuotient,
    MValue,
} from "../expression/mExpression"
import Expression from "../expression/Expression";

const getJSONFromExpression = (expression?: Expression): object | undefined | string => {
    let buffer: any;
    if (!expression) {
        buffer = undefined;
    }
    else if (expression instanceof GEquation) {
        buffer = {
            type: 'GEquation',
            gTerm1: getJSONFromExpression(expression.gTerm1),
            gTerm2: getJSONFromExpression(expression.gTerm2),
        }
    }
    else if (expression instanceof GTerm) {
        buffer = {
            type: 'GTerm',
            gTerm: getJSONFromExpression(expression.gTerm),
        }
    }
    else if (expression instanceof GSum) {
        buffer = {
            type: 'GSum',
            gSummands: expression.gSummands?.map(gSummand => getJSONFromExpression(gSummand)),
            startDirection: expression.startDirection,
        }
    }
    else if (expression instanceof GDifference) {
        buffer = {
            type: 'GDifference',
            gMinuend: getJSONFromExpression(expression.gMinuend),
            gSubtrahend: getJSONFromExpression(expression.gSubtrahend),
            startDirection: expression.startDirection,
        }
    }
    else if (expression instanceof GProduct1D) {
        buffer = {
            type: 'GProduct1D',
            gSimpleFactor: getJSONFromExpression(expression.gSimpleFactor),
            gComplexFactor: getJSONFromExpression(expression.gComplexFactor),
            startDirection: expression.startDirection,
        }
    }
    else if (expression instanceof GProduct2D) {
        buffer = {
            type: 'GProduct2D',
            gFactorX: getJSONFromExpression(expression.gFactorX),
            gFactorY: getJSONFromExpression(expression.gFactorY),
            xEdge: expression.xEdge,
            yEdge: expression.yEdge,
        }
    }
    else if (expression instanceof GQuotient1D) {
        buffer = {
            type: 'GQuotient1D',
            gSimpleDivisor: getJSONFromExpression(expression.gSimpleDivisor),
            gComplexDivident: getJSONFromExpression(expression.gComplexDivident),
            startDirection: expression.startDirection,
        }
    }
    else if (expression instanceof GQuotient2D) {
        buffer = {
            type: 'GQuotient2D',
            gDivident: getJSONFromExpression(expression.gDivident),
            gDivisor: getJSONFromExpression(expression.gDivisor),
            divisorEdge: expression.divisorEdge,
            resultEdge: expression.resultEdge,
        }
    }
    else if (expression instanceof GValue) {
        buffer = {
            type: 'GValue',
            mValue: getJSONFromExpression(expression.mValue),
            xEdge: expression.xEdge,
            yEdge: expression.yEdge,
            unscaledWidth: expression.unscaledWidth,
            unscaledHeight: expression.unscaledHeight,
            numericValue: expression.numericValue,
        }
    }
    else if (expression instanceof GSimpleValue) {
        buffer = {
            type: 'GSimpleValue',
            mSimpleValue: getJSONFromExpression(expression.mSimpleValue),
            edge: expression.edge,
            unscaledWidth: expression.unscaledWidth,
            unscaledHeight: expression.unscaledHeight,
            numericValue: expression.numericValue,
        }
    }
    else if (expression instanceof MSum) {
        buffer = expression.mSummands?.map(mSummand => getJSONFromExpression(mSummand)).join('+');
    }
    else if (expression instanceof MDifference) {
        buffer = `${getJSONFromExpression(expression.mMinuend)}-${getJSONFromExpression(expression.mSubtrahend)}`
    }
    else if (expression instanceof MProduct) {
        buffer = expression.mFactors
            ?.map(mFactor => [getJSONFromExpression(mFactor), !(mFactor instanceof MValue)]) // TODO or ! instanceof MProduct
            .map(([valueStr, isBracket]) => isBracket ? `(${valueStr})` : valueStr).join('*');
    }
    else if (expression instanceof MQuotient) {
        const [mDividentStr, mDivisorStr] = [expression.mDivident, expression.mDivisor]
            ?.map(mChild => [getJSONFromExpression(mChild), !(mChild instanceof MValue)])
            .map(([valueStr, isBracket]) => isBracket ? `(${valueStr})` : valueStr);
        buffer = `${mDividentStr}/${mDivisorStr}`
    }
    else if (expression instanceof MValue) {
        buffer = expression.mValue;
    }

    if (!!buffer && expression instanceof GExpression) {
        buffer.id = expression.id;
    }
    return buffer;
}

export default getJSONFromExpression;