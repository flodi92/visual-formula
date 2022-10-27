import {
    GAbstractRoot,
    GAbstractValue,
    GExpression,
    GEquation,
    GAbstractDirectedExpression,
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
    MEquation,
    MSum,
    MDifference,
    MProduct,
    MQuotient,
    MValue,
} from "../expression/mExpression"

import { ID, Operator } from "../types";
import MExpression from "../expression/mExpression/MExpression";
import Expression from "../expression/Expression";

export const getExpressionFromJSON = (value: any, idCount: ID = 0) => {
    if (typeof value === 'string' && value.includes('{')) value = JSON.parse(value);

    const _getOperatorPositions = (str: string, operator: Operator): number[] => {
        let bracketCount = 0;
        let buffer: number[] = [];
        for (let pos = 0; pos < str.length; pos++) {
            const char = str.charAt(pos);
            if (char === "(") bracketCount++;
            else if (char === ")") bracketCount--;
            else if (char === operator && bracketCount === 0) {
                buffer.push(pos);
            }
        }

        return buffer;
    };

    const _removeBracketTrim = (str: string) => {
        str = str.trim();
        if (str[0] === "(" && str[str.length - 1] === ")") {
            str = str.substring(1, str.length - 1);
        }
        str = str.trim();

        return str;
    };

    const _getMExpressionFromString = (str = "", id: ID): MExpression => {
        str = _removeBracketTrim(str);

        let [positions, type] = [_getOperatorPositions(str, "="), "MEquation"];
        if (!positions.length)
            [positions, type] = [_getOperatorPositions(str, "+"), "MSum"];
        if (!positions.length)
            [positions, type] = [_getOperatorPositions(str, "-"), "MDifference"];
        if (!positions.length)
            [positions, type] = [_getOperatorPositions(str, "*"), "MProduct"];
        if (!positions.length)
            [positions, type] = [_getOperatorPositions(str, "/"), "MQuotient"];

        let expression: MExpression;
        if (!!positions.length) {
            const fragments = [-1, ...positions]
                .map((pos, idx, arr) => [
                    pos + 1,
                    idx < arr.length ? arr[idx + 1] : str.length,
                ])
                .map(([start, end]) => str.substring(start, end).trim());

            const children = fragments.map((fragment, idx) => _getMExpressionFromString(fragment, id + idx + 1));
            if (type === "MSum") {
                expression = new MSum();
                (expression as MSum).mSummands = children;
            } else if (type === "MDifference") {
                expression = new MDifference();
                (expression as MDifference).mMinuend = children[0];
                (expression as MDifference).mSubtrahend = children[1];
            } else if (type === "MProduct") {
                expression = new MProduct();
                (expression as MProduct).mFactors = children;
            } else if (type === "MQuotient") {
                expression = new MQuotient();
                (expression as MQuotient).mDivident = children[0];
                (expression as MQuotient).mDivisor = children[1];
            } else if ((type = "MEquation")) {
                expression = new MEquation();
                (expression as MEquation).mTerm1 = children[0];
                (expression as MEquation).mTerm2 = children[1];
            }
        } else {
            expression = new MValue();
            (expression as MValue).mValue = str;
        }

        return _getMExpressionFromString(`${str}`, id);
    };

    const _getExpressionFromJSON = (json: any, idCount: ID = 0) => {
        if (!json) return undefined;
        let expression: any;
        switch (json.type) {
            case 'GEquation':
                expression = new GEquation();
                expression.gTerm1 = _getExpressionFromJSON(json.gTerm1, idCount + 1);
                expression.gTerm2 = _getExpressionFromJSON(json.gTerm2, idCount + 2);
                break;
            case 'GTerm':
                expression = new GTerm();
                expression.gTerm = _getExpressionFromJSON(json.gTerm, idCount + 1);
                break;
            case 'GSum':
                expression = new GSum();
                expression.gSummands = json.gSummands?.map(
                    (gSummand: any, idx: number) => _getExpressionFromJSON(gSummand, idCount + idx + 1)
                )
                break;
            case 'GDifference':
                expression = new GDifference();
                expression.gMinuend = _getExpressionFromJSON(json.gMinuend, idCount + 1);
                expression.gSubtrahend = _getExpressionFromJSON(json.gSubtrahend, idCount + 2);
                break;
            case 'GProduct1D':
                expression = new GProduct1D();
                expression.gSimpleFactor = _getExpressionFromJSON(json.gSimpleFactor, idCount + 1);
                expression.gComplexFactor = _getExpressionFromJSON(json.gComplexFactor, idCount + 2);
                break;
            case 'GProduct2D':
                expression = new GProduct2D();
                expression.gFactorX = _getExpressionFromJSON(json.gFactorX, idCount + 1);
                expression.gFactorY = _getExpressionFromJSON(json.gFactorY, idCount + 2);
                break;
            case 'GQuotient1D':
                expression = new GQuotient1D();
                expression.gSimpleDivisor = _getExpressionFromJSON(json.gSimpleDivisor, idCount + 1);
                expression.gComplexDivident = _getExpressionFromJSON(json.gComplexDivident, idCount + 2);
                break;
            case 'GQuotient2D':
                expression = new GQuotient2D();
                expression.gDivident = _getExpressionFromJSON(json.gDivident, idCount + 1);
                expression.gDivisor = _getExpressionFromJSON(json.gDivisor, idCount + 2);
                break;
            case 'GValue':
                expression = new GValue();
                expression.mValue = _getMExpressionFromString(json.mValue, idCount + 1);
                expression.xEdge = json.xEdge;
                expression.yEdge = json.yEdge;
                break;
            case 'GSimpleValue':
                expression = new GSimpleValue();
                expression.mSimpleValue = _getExpressionFromJSON(json.mSimpleValue, idCount + 1);
                expression.edge = json.edge;
                break;
        }
        expression.id = idCount;

        if (expression instanceof GAbstractDirectedExpression) {
            expression.startDirection = json.startDirection;
        }
        else if (expression instanceof GAbstractValue) {
            expression.numericValue = json.numericValue;
        }

        return expression as GExpression;
    }

    let expression = (typeof value === 'string') ?
        _getMExpressionFromString(value, idCount)
        : _getExpressionFromJSON(value, idCount);

    if (expression instanceof GExpression && !(expression instanceof GAbstractRoot)) {
        const gTerm = new GTerm()
        gTerm.gTerm = expression;
        expression = gTerm;
    }
    return expression;
}

const getJSONFromExpression = (expression?: Expression): object | undefined | string => {

    if (!expression) return undefined;
    else if (expression instanceof GEquation) {
        return {
            type: 'GEquation',
            gTerm1: getJSONFromExpression(expression.gTerm1),
            gTerm2: getJSONFromExpression(expression.gTerm2),
        }
    }
    else if (expression instanceof GTerm) {
        return {
            type: 'GTerm',
            gTerm: getJSONFromExpression(expression.gTerm),
        }
    }
    else if (expression instanceof GSum) {
        return {
            type: 'GSum',
            gSummands: expression.gSummands?.map(gSummand => getJSONFromExpression(gSummand)),
        }
    }
    else if (expression instanceof GDifference) {
        return {
            type: 'GDifference',
            gMinuend: getJSONFromExpression(expression.gMinuend),
            gSubtrahend: getJSONFromExpression(expression.gSubtrahend),
        }
    }
    else if (expression instanceof GProduct1D) {
        return {
            type: 'GProduct1D',
            gSimpleFactor: getJSONFromExpression(expression.gSimpleFactor),
            gComplexFactor: getJSONFromExpression(expression.gComplexFactor),
        }
    }
    else if (expression instanceof GProduct2D) {
        return {
            type: 'GProduct2D',
            gFactorX: getJSONFromExpression(expression.gFactorX),
            gFactorY: getJSONFromExpression(expression.gFactorY),
        }
    }
    else if (expression instanceof GQuotient1D) {
        return {
            type: 'GQuotient1D',
            gSimpleDivisor: getJSONFromExpression(expression.gSimpleDivisor),
            gComplexDivident: getJSONFromExpression(expression.gComplexDivident),
        }
    }
    else if (expression instanceof GQuotient2D) {
        return {
            type: 'GQuotient2D',
            gDivident: getJSONFromExpression(expression.gDivident),
            gDivisor: getJSONFromExpression(expression.gDivisor),
        }
    }
    else if (expression instanceof GValue) {
        return {
            type: 'GValue',
            mValue: getJSONFromExpression(expression.mValue),
            xEdge: expression.xEdge,
            yEdge: expression.yEdge,
        }
    }
    else if (expression instanceof GSimpleValue) {
        return {
            type: 'GSimpleValue',
            mSimpleValue: getJSONFromExpression(expression.mSimpleValue),
            edge: expression.edge,
        }
    }
    else if (expression instanceof MSum) {
        return `(${expression.mSummands?.map(mSummand => getJSONFromExpression(mSummand)).join('+')})`;
    }
    else if (expression instanceof MDifference) {
        return `(${expression.mMinuend}-${expression.mSubtrahend})`
    }
    else if (expression instanceof MProduct) {
        return expression.mFactors?.map(mFactor => getJSONFromExpression(mFactor)).join('*');
    }
    else if (expression instanceof MQuotient) {
        return `${expression.mDivident}/${expression.mDivisor}`
    }
}



const getExpressionFromFormula = (str: string, idCount = 0) => {

}
