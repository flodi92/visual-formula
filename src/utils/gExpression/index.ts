import GExpression from "../../expression/gExpression/GExpression";
import GAbstractValue from "../../expression/gExpression/GAbstractValue";
import GSimpleValue from "../../expression/gExpression/GSimpleValue";
import GValue from "../../expression/gExpression/GValue";

import { ID, } from "../../types";

import getNeighbours from "./getNeighbours";
import getCommonEdgeValues from "./getCommonEdgeValues";
import isEdgePossible from "./isEdgePossible";

export const getWidths = (expressions: GExpression[]) => expressions.map(_expression => _expression?.unscaledWidth || 0) || [];
export const getHeights = (expressions: GExpression[]) => expressions.map(_expression => _expression?.unscaledHeight || 0) || [];

export const getFixedWidthOfNeighbour = (gValue: GValue) => {
    const neighbours = getNeighbours(gValue, 'Y');
    const normedNeighbour = neighbours.find(neighbour => neighbour.isNormY); // TODO expecting all neighbours of same height
    return normedNeighbour?.width
}

export const getFixedHeightOfNeighbour = (gValue: GValue) => {
    const neighbours = getNeighbours(gValue, 'X');
    const normedNeighbour = neighbours.find(neighbour => neighbour.isNormX); // TODO expecting all neighbours of same height
    return normedNeighbour?.height
}

export const getGValues = (expression: GExpression): GValue[] => {
    if (expression instanceof GValue) return [expression];
    else if (expression instanceof GSimpleValue) {
        return []
    }
    else {
        return (expression.children as any[]).reduce((prev, child: GExpression) => [...prev, ...getGValues(child)], []);
    }
}

export const getGAbstractValues = (expression: GExpression): GAbstractValue[] => {
    if (expression instanceof GAbstractValue) {
        return !!expression ? [expression] : [];
    } else {
        return expression.children
            .map((child) => child ? getGAbstractValues(child as GExpression) : [])
            .reduce((prev, curr) => [...prev, ...curr]);
    }
}

export const getGAbstractValueIds = (expression: GExpression): ID[] => {
    return getGAbstractValues(expression).map(gaValue => gaValue.id).filter(id => id !== undefined) as ID[]
}

export { getNeighbours, getCommonEdgeValues, isEdgePossible };