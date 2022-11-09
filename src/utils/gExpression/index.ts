import GExpression from "../../expression/gExpression/GExpression";
import GAbstractValue from "../../expression/gExpression/GAbstractValue";
import GValue from "../../expression/gExpression/GValue";
import { GSimpleValue } from "../../expression/gExpression";

import { ID, } from "../../types";

import getWidths from "./getWidths";
import getHeights from "./getHeights";
import getNeighbours from "./getNeighbours";
import getCommonEdgeValues from "./getCommonEdgeValues";
import isEdgePossible from "./isEdgePossible";
import { getXNormedValues, getYNormedValues } from "./getNormedValues";

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

export {
    getWidths,
    getHeights,
    getFixedWidthOfNeighbour,
    getFixedHeightOfNeighbour,
    getGValues,
    getGSimpleValues,
    getGAbstractValues,
    getGAbstractValueIds,
    getNeighbours,
    getCommonEdgeValues,
    isEdgePossible,
    getXNormedValues,
    getYNormedValues,
};