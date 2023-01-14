import { isInteger, isNumber } from "lodash";
import {
    GExpression,
    GProduct1D,
    GQuotient1D,
    GValue
} from "../expression/gExpression";
import { directionToXY } from "../utils/general";

import { getFixedHeightOfNeighbour, getFixedWidthOfNeighbour, getGSimpleValues, getGValues, getParentXY, getXNormedValues, getYNormedValues } from "../utils/gExpression";

const autoConfigSize = (gExpression: GExpression) => {
    const xNormedValue = getXNormedValues(gExpression);
    const yNormedValue = getYNormedValues(gExpression);

    xNormedValue.forEach(gValue => isNumber(gValue.numericValue)
        && ([gValue.unscaledWidth, gValue.unscaledHeight] = [1, gValue.numericValue]));

    yNormedValue.forEach(gValue => isNumber(gValue.numericValue)
        && ([gValue.unscaledWidth, gValue.unscaledHeight] = [gValue.numericValue, 1]));

    let gValues = getGValues(gExpression);
    let gSimpleValues = getGSimpleValues(gExpression);

    let startLength = Number.POSITIVE_INFINITY, endLength = Number.NEGATIVE_INFINITY;
    while (startLength > endLength) {
        startLength = gValues.length + gSimpleValues.length;

        let _startLength = Number.POSITIVE_INFINITY, _endLength = Number.NEGATIVE_INFINITY;
        while (_startLength > _endLength) {
            _startLength = gValues.length + gSimpleValues.length;

            gValues = gValues.filter(gValue => {
                const unscaledWidth = getFixedWidthOfNeighbour(gValue) || gValue.unscaledWidth;
                const unscaledHeight = getFixedHeightOfNeighbour(gValue) || gValue.unscaledHeight;

                if (unscaledWidth !== undefined && unscaledHeight === undefined) {
                    gValue.unscaledWidth = unscaledWidth;
                    gValue.unscaledHeight = (gValue.numericValue || 0) / unscaledWidth;
                    return false;
                }
                else if (unscaledWidth === undefined && unscaledHeight !== undefined) {
                    gValue.unscaledWidth = (gValue.numericValue || 0) / unscaledHeight;
                    gValue.unscaledHeight = unscaledHeight;
                    return false;
                }
                return true;
            })

            gSimpleValues = gSimpleValues.filter(
                gSimpleValue => {
                    const { parent, numericValue } = gSimpleValue;
                    if (!parent || numericValue === undefined) return true;

                    if (parent instanceof GProduct1D) {
                        if (directionToXY(parent.startDirection) === "X"
                            && parent.gComplexFactor?.unscaledWidth !== undefined) {
                            gSimpleValue.unscaledWidth = parent.gComplexFactor.unscaledWidth * (numericValue - 1);
                            gSimpleValue.unscaledHeight = parent.gComplexFactor.unscaledHeight;
                            return false;
                        } else if (directionToXY(parent.startDirection) === "Y"
                            && parent.gComplexFactor?.unscaledHeight !== undefined) {
                            gSimpleValue.unscaledHeight = parent.gComplexFactor.unscaledHeight * (numericValue - 1);
                            gSimpleValue.unscaledWidth = parent.gComplexFactor.unscaledWidth;
                            return false;
                        }
                    } else if (parent instanceof GQuotient1D) {
                        if (directionToXY(parent.startDirection) === "X"
                            && parent.gComplexDivident?.unscaledWidth !== undefined) {
                            gSimpleValue.unscaledWidth = parent.gComplexDivident.unscaledWidth
                                - parent.gComplexDivident.unscaledWidth / numericValue;
                            gSimpleValue.unscaledHeight = parent.gComplexDivident.unscaledHeight;
                            return false;
                        } else if (directionToXY(parent.startDirection) === "Y"
                            && parent.gComplexDivident?.unscaledHeight !== undefined) {
                            gSimpleValue.unscaledHeight = parent.gComplexDivident.unscaledHeight
                                - parent.gComplexDivident.unscaledHeight / numericValue;
                            gSimpleValue.unscaledWidth = parent.gComplexDivident.unscaledWidth;
                            return false;
                        }
                    }
                    return true;
                }
            )

            _endLength = gValues.length + gSimpleValues.length;
        }

        gValues = gValues.filter(gValue => {
            if (([gValue.unscaledWidth, gValue.unscaledHeight].some(size => size !== undefined))) return true;

            const width = getFixedWidthOfNeighbour(gValue);
            const height = getFixedHeightOfNeighbour(gValue);

            if (width === undefined && height === undefined && gValue.numericValue) {
                [gValue.unscaledWidth, gValue.unscaledHeight] = suggestFactors(gValue);

                return false;
            }
            return true;
        })

        endLength = gValues.length + gSimpleValues.length;
    }
}

const suggestFactors = (gValue: GValue): [number | undefined, number | undefined] => {
    const { numericValue } = gValue;
    if (numericValue === undefined) return [undefined, undefined];

    if (!isInteger(numericValue)) { return [Math.sqrt(numericValue), Math.sqrt(numericValue)]; }

    const start = Math.floor(Math.sqrt(numericValue));

    for (let i = start; i < numericValue; i++) {
        if (numericValue % start === 0) {
            return getParentXY(gValue) === "X" ? [numericValue / i, i] : [i, numericValue / i];
        }
    }

    return [undefined, undefined];
}

export default autoConfigSize;
