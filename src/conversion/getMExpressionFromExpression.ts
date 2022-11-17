import {
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
    MEquation,
    MExpression,
} from "../expression/mExpression"
import Expression from "../expression/Expression";

const getMExpressionFromExpression = (expression?: Expression): MExpression | undefined => {
    let buffer: any;
    if (!expression) {
        buffer = undefined;
    }
    else if (expression instanceof GEquation) {
        buffer = new MEquation();
        buffer.mTerm1 = getMExpressionFromExpression(expression.gTerm1);
        buffer.mTerm2 = getMExpressionFromExpression(expression.gTerm2);
    }
    else if (expression instanceof GTerm) {
        buffer = getMExpressionFromExpression(expression.gTerm)
    }
    else if (expression instanceof GSum) {
        buffer = new MSum();
        buffer.mSummands = expression.gSummands?.map(gSummand => getMExpressionFromExpression(gSummand))
    }
    else if (expression instanceof GDifference) {
        buffer = new MDifference();
        buffer.mMinuend = getMExpressionFromExpression(expression.gMinuend);
        buffer.mSubtrahend = getMExpressionFromExpression(expression.gSubtrahend);
    }
    else if (expression instanceof GProduct1D) {
        buffer = new MProduct();
        buffer.mFactors = [expression.gSimpleFactor, expression.gComplexFactor].map(gFactor => getMExpressionFromExpression(gFactor));
    }
    else if (expression instanceof GProduct2D) {
        buffer = new MProduct();
        buffer.mFactors = [expression.gFactorX, expression.gFactorY].map(gFactor => getMExpressionFromExpression(gFactor));
    }
    else if (expression instanceof GQuotient1D) {
        buffer = new MQuotient();
        buffer.mDivisor = getMExpressionFromExpression(expression.gSimpleDivisor);
        buffer.mDivident = getMExpressionFromExpression(expression.gComplexDivident);
    }
    else if (expression instanceof GQuotient2D) {
        buffer = new MQuotient();
        buffer.mDivisor = getMExpressionFromExpression(expression.gDivident);
        buffer.mDivident = getMExpressionFromExpression(expression.gDivisor);
    }
    else if (expression instanceof GValue) {
        buffer = getMExpressionFromExpression(expression.mValue);
    }
    else if (expression instanceof GSimpleValue) {
        buffer = getMExpressionFromExpression(expression.mSimpleValue);
    }
    else if (expression instanceof MExpression) {
        buffer = expression;
    }

    if (!!buffer && !!expression) {
        buffer.id = expression.id;
    }

    return buffer;
}

export default getMExpressionFromExpression;