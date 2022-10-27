import {
    GExpression,
    GSum,
    GDifference,
    GValue,
} from "../expression/gExpression"

import { getFixedHeightOfNeighbour, getFixedWidthOfNeighbour, getGValues } from "../utils/gExpression";

const autoConfigSize = (expression: GExpression) => {

    // unsetAllGValues(expression);

    let gValues = getGValues(expression) as GValue[];

    // gValues

    gValues = gValues.filter(gValue => {
        if (gValue.isNormX) {
            gValue.unscaledWidth = 1;
            gValue.unscaledHeight = gValue.numericValue;
            return false;
        }
        else if (gValue.isNormY) {
            gValue.unscaledWidth = gValue.numericValue;
            gValue.unscaledHeight = 1;
            return false;
        }
        return true
    })

    let startLength: number, endLength: number;

    while (!!gValues.length) {
        do {
            startLength = gValues.length;
            gValues = gValues.filter(gValue => {
                if (([gValue.width, gValue.height].some(size => size !== undefined))) return;

                const width = getFixedWidthOfNeighbour(gValue);
                const height = getFixedHeightOfNeighbour(gValue);

                if (width !== undefined && height === undefined) {
                    gValue.unscaledWidth = width;
                    gValue.unscaledHeight = gValue.numericValue / width;
                    return false;
                }
                else if (width === undefined && height !== undefined) {
                    gValue.unscaledWidth = gValue.numericValue / height;
                    gValue.unscaledHeight = height;
                    return false;
                }
                return true;
            })
            endLength = gValues.length;
        } while (startLength > endLength)


        gValues = gValues.filter(gValue => {
            if (([gValue.unscaledWidth, gValue.unscaledHeight].some(size => size !== undefined))) return;

            const width = getFixedWidthOfNeighbour(gValue);
            const height = getFixedHeightOfNeighbour(gValue);

            if (width === undefined && height === undefined) {
                gValue.unscaledWidth = Math.sqrt(gValue.numericValue);
                gValue.unscaledHeight = Math.sqrt(gValue.numericValue);
                return false;
            }
            return true;
        })

    }



    if (expression instanceof GSum || expression instanceof GDifference) {
        const y = expression.unscaledWidth


    }
    else if (expression instanceof GValue) {
        throw '';
    }

}