import GExpression from "../../expression/gExpression/GExpression";
import GAbstractValue from "../../expression/gExpression/GAbstractValue";
import GValue from "../../expression/gExpression/GValue";
import { GAbstractDirectedExpression, GProduct2D, GQuotient2D, GSimpleValue } from "../../expression/gExpression";

import { ID, XY, } from "../../types";
import { directionToXY } from "../general";
import { expressionToArray } from "../expression";

import getWidths from "./getWidths";
import getHeights from "./getHeights";
import getNeighbours from "./getNeighbours";
import getCommonEdgeValues from "./getCommonEdgeValues";
import isEdgePossible from "./isEdgePossible";
import getEdgeCoords from "./getEdgeCoords";
import getGappedNeighbours from "./getGappedNeighbours";
import { getXNormedValues, getYNormedValues } from "./getNormedValues";

import {
    getSummands, setSummands, getSubtrahends, setSubtrahends, sumStartDirection, differenceStartDirection,
} from "./summandsSubtrahends"
import Expression from "../../expression/Expression";

const getFixedWidthOfNeighbour = (gValue: GValue) => {
    const neighbours = getNeighbours(gValue, 'Y');
    const normedNeighbour = neighbours.find(neighbour => neighbour.unscaledWidth !== undefined); // TODO expecting all neighbours of same height
    return normedNeighbour?.unscaledWidth || undefined
}

const getFixedHeightOfNeighbour = (gValue: GValue) => {
    const neighbours = getNeighbours(gValue, 'X');
    const normedNeighbour = neighbours.find(neighbour => neighbour.unscaledHeight !== undefined); // TODO expecting all neighbours of same height
    return normedNeighbour?.unscaledHeight || undefined
}

const getGValues = (expression: GExpression): GValue[] => { // TODO simplify by expressionToArray
    if (!expression) return [];
    else if (expression instanceof GValue) return [expression];
    else {
        return (expression.children as any[])
            .reduce((prev, child: GExpression) => [...prev, ...getGValues(child)], []);
    }
}

const getGSimpleValues = (expression: GExpression): GSimpleValue[] => {
    if (!expression) return [];
    else if (expression instanceof GSimpleValue) return [expression];
    else {
        return (expression.children as any[])
            .reduce((prev, child: GExpression) => [...prev, ...getGSimpleValues(child)], []);
    }
}

const getGAbstractValues = (expression: GExpression): GAbstractValue[] => {
    if (!expression) return [];
    else if (expression instanceof GAbstractValue) return [expression];
    else {
        return (expression.children as any[])
            .reduce((prev, child: GExpression) => [...prev, ...getGAbstractValues(child)], []);
    }
}

const getGAbstractValueIds = (expression: GExpression): ID[] => {
    return getGAbstractValues(expression).map(gaValue => gaValue.id).filter(id => id !== undefined) as ID[]
}

const getMinMaxCoordinates = (gRoot: GExpression) => {
    const gValues = expressionToArray(gRoot).filter(expression => expression instanceof GAbstractValue) as GAbstractValue[];

    let [minX, minY] = [
        gValues.map(({ x }) => x),
        gValues.map(({ y }) => y)
    ].map(vals => Math.min(...vals));

    let [maxX, maxY] = [
        gValues.map(({ x, width }) => x + width),
        gValues.map(({ y, height }) => y + height)
    ].map(vals => Math.max(...vals));

    return { minX, minY, maxX, maxY };
}


const isNormableToXY = (gExpression?: GExpression, xy?: XY): boolean => {
    if (!gExpression || gExpression instanceof GValue) return true;
    if (gExpression instanceof GProduct2D || gExpression instanceof GQuotient2D) return false;
    if (gExpression instanceof GAbstractDirectedExpression)
        return (
            directionToXY(gExpression.startDirection) !== xy &&
            gExpression.children.every(child => isNormableToXY(<GExpression>child, xy))
        );
    if (gExpression instanceof GSimpleValue)
        return directionToXY(gExpression.edge) === xy;
    return false;
};

// TODO which implementation to use
// export const getNeighbours = (gExpression: GExpression | undefined, xy: XY, visited: number[] = []): GExpression[] => {
//     if (!gExpression?.id || visited.includes(gExpression.id)) return [];
//     visited.push(gExpression.id);
//     let buffer: GExpression[] = [];
//     let isCheckParent = false;

//     if (gExpression instanceof GValue || gExpression instanceof GSimpleValue) {
//         buffer.push(gExpression);
//         isCheckParent = true;
//     } else if (
//         gExpression instanceof GAbstractDirectedExpression
//     ) {
//         if (directionToXY(gExpression.startDirection) === xy) {
//             buffer.push(
//                 ...flatten(
//                     gExpression
//                         .children
//                         .map((child) => getNeighbours(child as GExpression, xy, visited))
//                 )
//             );
//             isCheckParent = true;
//         } else {
//             buffer.push(gExpression); // do not check children
//             isCheckParent = false;
//         }
//     } else if (gExpression instanceof GProduct2D) {
//         buffer.push(
//             ...getNeighbours(gExpression[`gFactor${getOtherXY(xy)}`], xy, visited)
//         );
//         isCheckParent = false;
//     } else if (gExpression instanceof GEquation) {
//         buffer.push(
//             ...getNeighbours(gExpression.gTerm1, xy, visited),
//             ...getNeighbours(gExpression.gTerm2, xy, visited)
//         );
//     }

//     // parent GProduct2D
//     if (
//         (gExpression.typeInParent === "gFactorX" && xy === "Y") ||
//         (gExpression.typeInParent === "gFactorY" && xy === "X")
//     ) {
//         isCheckParent = false;
//     }
//     // parent GQuotient2D
//     else if (
//         gExpression.parent instanceof GQuotient2D &&
//         directionToXY(gExpression.parent.divisorEdge) === xy
//     ) {
//         buffer.push(
//             ...getNeighbours(gExpression.parent.gDivisor, xy, visited),
//             ...getNeighbours(gExpression.parent.gDivident, xy, visited)
//         );
//     }

//     isCheckParent &&
//         buffer.push(...getNeighbours(gExpression.parent as GExpression, xy, visited));

//     return buffer;
// };

// const getXNeighbours = (gExpression: GExpression): GExpression[] => {
//     return getNeighbours(gExpression, 'X', []);
//   }

//   const getYNeighbours = (gExpression: GExpression): GExpression[] => {
//     return getNeighbours(gExpression, 'Y', []);
//   }

const getXNeighbours = (gExpression: GExpression): GExpression[] => {
    return getNeighbours(gExpression, 'X');
}

const getYNeighbours = (gExpression: GExpression): GExpression[] => {
    return getNeighbours(gExpression, 'Y');
}

const getParentXY = (expression?: Expression): XY | undefined =>
    !expression ? undefined :
        (expression instanceof GAbstractDirectedExpression) ? directionToXY(expression.startDirection) :
            getParentXY(expression.parent)

export {
    getWidths,
    getHeights,
    getFixedWidthOfNeighbour,
    getFixedHeightOfNeighbour,
    getGValues,
    getGSimpleValues,
    getGAbstractValues,
    getGAbstractValueIds,
    getMinMaxCoordinates,
    getNeighbours,
    getXNeighbours,
    getYNeighbours,
    isNormableToXY,
    getCommonEdgeValues,
    isEdgePossible,
    getEdgeCoords,
    getGappedNeighbours,
    getXNormedValues,
    getYNormedValues,
    getSummands,
    setSummands,
    getSubtrahends,
    setSubtrahends,
    sumStartDirection,
    differenceStartDirection,
    getParentXY,
};