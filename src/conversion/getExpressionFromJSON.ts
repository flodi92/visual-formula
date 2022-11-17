import {
    GAbstractRoot,
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
    MExpression,
    MEquation,
    MSum,
    MDifference,
    MProduct,
    MQuotient,
    MValue,
} from "../expression/mExpression"

import { Operator } from "../types";
import { setUnsetIDs } from "../utils/expression";

const getExpressionFromJSON = (value: any) => {
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

    const _getMExpressionFromString = (str = ""): MExpression | undefined => {
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


        let expression: any = undefined;

        if (!!positions.length) {
            const fragments = [-1, ...positions]
                .map((pos, idx, arr) => [
                    pos + 1,
                    idx < arr.length ? arr[idx + 1] : str.length,
                ])
                .map(([start, end]) => str.substring(start, end).trim());

            const children = fragments.map((fragment) => _getMExpressionFromString(fragment)).filter(child => !!child) as GExpression[];
            if (type === "MSum") {
                expression = new MSum();
                expression.mSummands = children;
            } else if (type === "MDifference") {
                expression = new MDifference();
                expression.mMinuend = children[0];
                expression.mSubtrahend = children[1];
            } else if (type === "MProduct") {
                expression = new MProduct();
                expression.mFactors = children;
            } else if (type === "MQuotient") {
                expression = new MQuotient();
                expression.mDivident = children[0];
                expression.mDivisor = children[1];
            } else if ((type = "MEquation")) {
                expression = new MEquation();
                expression.mTerm1 = children[0];
                expression.mTerm2 = children[1];
            }
        } else {
            expression = new MValue();
            (expression as MValue).mValue = str;
        }

        return expression;
    };

    const _getExpressionFromJSON = (json: any) => {
        if (!json) return undefined;
        let expression: any;
        switch (json.type) {
            case 'GEquation':
                expression = new GEquation();
                expression.gTerm1 = _getExpressionFromJSON(json.gTerm1);
                expression.gTerm2 = _getExpressionFromJSON(json.gTerm2);
                break;
            case 'GTerm':
                expression = new GTerm();
                expression.gTerm = _getExpressionFromJSON(json.gTerm);
                break;
            case 'GSum':
                expression = new GSum();
                expression.gSummands = json.gSummands?.map(
                    (gSummand: any, idx: number) => _getExpressionFromJSON(gSummand)
                )
                break;
            case 'GDifference':
                expression = new GDifference();
                expression.gMinuend = _getExpressionFromJSON(json.gMinuend);
                expression.gSubtrahend = _getExpressionFromJSON(json.gSubtrahend);
                break;
            case 'GProduct1D':
                expression = new GProduct1D();
                expression.gSimpleFactor = _getExpressionFromJSON(json.gSimpleFactor);
                expression.gComplexFactor = _getExpressionFromJSON(json.gComplexFactor);
                break;
            case 'GProduct2D':
                expression = new GProduct2D();
                expression.xEdge = json.xEdge;
                expression.yEdge = json.yEdge;
                expression.gFactorX = _getExpressionFromJSON(json.gFactorX);
                expression.gFactorY = _getExpressionFromJSON(json.gFactorY);
                break;
            case 'GQuotient1D':
                expression = new GQuotient1D();
                expression.gSimpleDivisor = _getExpressionFromJSON(json.gSimpleDivisor);
                expression.gComplexDivident = _getExpressionFromJSON(json.gComplexDivident);
                break;
            case 'GQuotient2D':
                expression = new GQuotient2D();
                expression.divisorEdge = json.divisorEdge;
                expression.resultEdge = json.resultEdge;
                expression.gDivident = _getExpressionFromJSON(json.gDivident);
                expression.gDivisor = _getExpressionFromJSON(json.gDivisor);
                break;
            case 'GValue':
                expression = new GValue();
                expression.mValue = _getMExpressionFromString(json.mValue);
                expression.xEdge = json.xEdge;
                expression.yEdge = json.yEdge;
                expression.unscaledWidth = json.unscaledWidth;
                expression.unscaledHeight = json.unscaledHeight;
                expression.numericValue = json.numericValue;
                break;
            case 'GSimpleValue':
                expression = new GSimpleValue();
                expression.mSimpleValue = _getMExpressionFromString(json.mSimpleValue);
                expression.edge = json.edge;
                expression.unscaledWidth = json.unscaledWidth;
                expression.unscaledHeight = json.unscaledHeight;
                expression.numericValue = json.numericValue;
                break;
            default: return undefined;
        }
        if (expression instanceof GAbstractDirectedExpression) {
            expression.startDirection = json.startDirection;
        }
       
        expression.id = json.id;

        return expression as GExpression;
    }

    let expression = (typeof value === 'string') ?
        _getMExpressionFromString(value)
        : _getExpressionFromJSON(value);

    if (expression instanceof GExpression && !(expression instanceof GAbstractRoot)) {
        const gTerm = new GTerm()
        gTerm.gTerm = expression;
        expression = gTerm;
    }

    setUnsetIDs(expression);    
    return expression;
}

export default getExpressionFromJSON;