import GExpression from "../../expression/gExpression/GExpression";
import GAbstractValue from "../../expression/gExpression/GAbstractValue";
import GSimpleValue from "../../expression/gExpression/GSimpleValue";
import GValue from "../../expression/gExpression/GValue";

import { ID, } from "../../types";

import getWidths from "./getWidths";
import getHeights from "./getHeights";
import getNeighbours from "./getNeighbours";
import getCommonEdgeValues from "./getCommonEdgeValues";
import isEdgePossible from "./isEdgePossible";

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

const getGValues = (expression: GExpression): GValue[] => {
    if (expression instanceof GValue) return [expression];
    else if (expression instanceof GSimpleValue) {
        return []
    }
    else {
        return (expression.children as any[]).reduce((prev, child: GExpression) => [...prev, ...getGValues(child)], []);
    }
}

const getGAbstractValues = (expression: GExpression): GAbstractValue[] => {
    if (expression instanceof GAbstractValue) {
        return !!expression ? [expression] : [];
    } else {
        return expression.children
            .map((child) => child ? getGAbstractValues(child as GExpression) : [])
            .reduce((prev, curr) => [...prev, ...curr]);
    }
}

const getGAbstractValueIds = (expression: GExpression): ID[] => {
    return getGAbstractValues(expression).map(gaValue => gaValue.id).filter(id => id !== undefined) as ID[]
}

export {
    getWidths,
    getHeights,
    getFixedWidthOfNeighbour,
    getFixedHeightOfNeighbour,
    getGValues,
    getGAbstractValues,
    getGAbstractValueIds,
    getNeighbours,
    getCommonEdgeValues,
    isEdgePossible
};