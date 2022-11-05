import { isNumber } from "lodash";
import {
    GExpression,
    GValue,
} from "../expression/gExpression"

import { getFixedHeightOfNeighbour, getFixedWidthOfNeighbour, getGValues } from "../utils/gExpression";

const getXNormedValues = (gExpression: GExpression): GValue[] => {
    return []; // TODO
}
const getYNormedValues = (gExpression: GExpression): GValue[] => {
    return []; // TODO
}

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