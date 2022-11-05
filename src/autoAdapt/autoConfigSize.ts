import { isNumber } from "lodash";
import {
    GAbstractDirectedExpression,
    GAbstractValue,
    GEquation,
    GExpression,
    GProduct2D,
    GQuotient2D,
    GTerm,
    GValue,
} from "../expression/gExpression"
import { ID, XY } from "../types";
import { directionToXY, getOtherXY } from "../utils/general";

import { getFixedHeightOfNeighbour, getFixedWidthOfNeighbour, getGValues } from "../utils/gExpression";

export const autoConfigSize = (gExpression: GExpression) => {
    const xNormedValue = getXNormedValues(gExpression);
    const yNormedValue = getYNormedValues(gExpression);

    xNormedValue.forEach(gValue => isNumber(gValue.numericValue)
        && ([gValue.unscaledWidth, gValue.unscaledHeight] = [1, gValue.numericValue]));

    yNormedValue.forEach(gValue => isNumber(gValue.numericValue)
        && ([gValue.unscaledWidth, gValue.unscaledHeight] = [gValue.numericValue, 1]));

    let gValues = getGValues(gExpression) as GValue[];

    while (!!gValues?.length) {
        let startLength: number, endLength: number;
        do {
            startLength = gValues.length;

            gValues = gValues.filter(gValue => {
                if (([gValue.unscaledWidth, gValue.unscaledHeight].some(size => size !== undefined))) return true;

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
            endLength = gValues.length;
        } while (startLength > endLength);

        gValues = gValues.filter(gValue => {
            if (([gValue.unscaledWidth, gValue.unscaledHeight].some(size => size !== undefined))) return true;

            const width = getFixedWidthOfNeighbour(gValue);
            const height = getFixedHeightOfNeighbour(gValue);


            if (width === undefined && height === undefined) {
                gValue.unscaledWidth = gValue.numericValue && Math.sqrt(gValue.numericValue);
                gValue.unscaledHeight = gValue.numericValue && Math.sqrt(gValue.numericValue);
                return false;
            }
            return true;
        })
    }
}

const getNormedValues = (gExpression: GExpression | undefined, xy: XY): GAbstractValue[] => {
    let visitedIDs: ID[] = [];

    const _down = (gExpression: GExpression | undefined, isNormed = false): GAbstractValue[] => {
        if (!gExpression?.id || visitedIDs.includes(gExpression.id)) return [];
        visitedIDs.push(gExpression.id);

        if (gExpression instanceof GAbstractValue) {
            return isNormed ? [gExpression] : [];
        } else if (gExpression instanceof GProduct2D) {
            if (xy === "X") {
                return gExpression?.gFactorY ? _down(gExpression.gFactorY, true) : [];
            } else { // xy === "Y"
                return gExpression?.gFactorX ? _down(gExpression.gFactorX, true) : [];
            }
        } else if (gExpression instanceof GQuotient2D) {
            return (
                directionToXY(gExpression.divisorEdge) === getOtherXY(xy) ?
                    _down(gExpression.gDivisor, true) :
                    directionToXY(gExpression.resultEdge) === getOtherXY(xy)
                        ? _up(gExpression.parent as GExpression | undefined) :
                        []);
        } else if (gExpression instanceof GAbstractDirectedExpression) {
            const areChildrenNormed = directionToXY(gExpression.startDirection) === getOtherXY(xy) && isNormed;
            return areChildrenNormed || !isNormed ?
                (gExpression.children as (GExpression | undefined)[])
                    .map((child) => _down(child, areChildrenNormed))
                    .reduce((prev, current) => [...prev, ...current], [])
                : []
        } else if (gExpression instanceof GEquation) {
            return [..._down(gExpression.gTerm1), ..._down(gExpression.gTerm2)]
        } else if (gExpression instanceof GTerm) {
            return _down(gExpression.gTerm);
        }
        return [];
    }

    const _up = (gExpression: GExpression | undefined): GAbstractValue[] => {
        if (!gExpression?.id) return [];
        return [..._down(gExpression, true), ..._up(gExpression)];
    }

    return _down(gExpression)
}

const getXNormedValues = (gExpression: GExpression): GAbstractValue[] => {
    return getNormedValues(gExpression, 'X');
}

const getYNormedValues = (gExpression: GExpression): GAbstractValue[] => {
    return getNormedValues(gExpression, 'Y');
}