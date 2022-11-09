import { isNumber } from "lodash";
import {
    GExpression,
    GProduct1D,
    GQuotient1D,
} from "../expression/gExpression"
import { directionToXY } from "../utils/general";

import { getFixedHeightOfNeighbour, getFixedWidthOfNeighbour, getGSimpleValues, getGValues, getXNormedValues, getYNormedValues } from "../utils/gExpression";

export const autoConfigSize = (gExpression: GExpression) => {
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
                if (([gValue.unscaledWidth, gValue.unscaledHeight].some(size => size !== undefined))) return false;

                const width = getFixedWidthOfNeighbour(gValue);
                const height = getFixedHeightOfNeighbour(gValue);

                if (width !== undefined && height === undefined) {
                    gValue.unscaledWidth = width;
                    gValue.unscaledHeight = (gValue.numericValue || 0) / width;
                    return false;
                }
                else if (width === undefined && height !== undefined) {
                    gValue.unscaledWidth = (gValue.numericValue || 0) / height;
                    gValue.unscaledHeight = height;
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
                            gSimpleValue.unscaledWidth = parent.gComplexDivident.unscaledWidth / numericValue;
                            gSimpleValue.unscaledHeight = parent.gComplexDivident.unscaledHeight;
                            return false;
                        } else if (directionToXY(parent.startDirection) === "Y"
                            && parent.gComplexDivident?.unscaledHeight !== undefined) {
                            gSimpleValue.unscaledHeight = parent.gComplexDivident.unscaledHeight / numericValue;
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
                gValue.unscaledWidth = Math.sqrt(gValue.numericValue);
                gValue.unscaledHeight = Math.sqrt(gValue.numericValue);
                return false;
            }
            return true;
        })

        endLength = gValues.length + gSimpleValues.length;
    }
}

