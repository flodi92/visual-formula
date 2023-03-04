import {
    GAbstractValue, GExpression, GSimpleValue, GValue
} from "../../expression/gExpression";

import { ALL_DIRECTIONS, CommonEdgeValue, Direction, GappedNeighbour, GappedNeighbours } from "../../types";
import { expressionToArray, getRoot } from "../expression";
import { isInRange, isIntersection } from "../general";


const getCommonEdgeValues = (expression: GExpression, direction: Direction): CommonEdgeValue[] => {

    const root = getRoot(expression);

    const gValues = expressionToArray(root)
        .filter(_expression => _expression instanceof GAbstractValue && _expression.id !== expression.id) as GAbstractValue[];

    const { unscaledX: x1, unscaledY: y1, unscaledWidth: w = 0, unscaledHeight: h = 0 } = expression;
    const x2 = x1 + w, y2 = y1 + h;

    const buffer: CommonEdgeValue[] = [];

    gValues.map(
        gValue => {
            const { unscaledX: _x1, unscaledY: _y1, unscaledWidth: _w = 0, unscaledHeight: _h = 0 } = gValue;
            return { gValue, _x1, _y1, _x2: _x1 + _w, _y2: _y1 + _h };
        })
        .forEach(
            ({ gValue, _x1, _y1, _x2, _y2 }) => {
                if (isIntersection(y1, y2, _y1, _y2)) {
                    if (direction === "right") {
                        if (x2 === _x1) {
                            buffer.push({ gValue, direction: "left" })
                        }
                        else if (x2 === _x2) {
                            buffer.push({ gValue, direction: "right" })
                        }
                    }
                    else if (direction === "left") {
                        if (x1 === _x2) {
                            buffer.push({ gValue, direction: "right" })
                        }
                        else if (x1 === _x1) {
                            buffer.push({ gValue, direction: "left" })
                        }
                    }
                }
                if (isIntersection(x1, x2, _x1, _x2)) {
                    if (direction === "bottom") {
                        if (y2 === _y1) {
                            buffer.push({ gValue, direction: "top" })
                        }
                        else if (y2 === _y2) {
                            buffer.push({ gValue, direction: "bottom" })
                        }
                    }
                    else if (direction === "top") {
                        if (y1 === _y2) {
                            buffer.push({ gValue, direction: "bottom" })
                        }
                        else if (y1 === _y1) {
                            buffer.push({ gValue, direction: "top" })
                        }
                    }
                }
            }
        );

    return buffer;
};

export const getGappedNeighbours = (expression: GAbstractValue): GappedNeighbours => {
    const buffer: GappedNeighbour[] = [];

    const root = getRoot(expression);

    const comparedValues = expressionToArray(root)
        .filter(_expression => _expression instanceof GAbstractValue && _expression.id !== expression.id) as GAbstractValue[];

    const coords = getEdgeCoords(expression);

    for (const comparedValue of comparedValues) {
        const _comparedCoords = getEdgeCoords(comparedValue);

        for (const [[x1, y1, d1], [x2, y2, d2], edgeDirection] of coords) {
            for (const [[_x1, _y1, _d1], [_x2, _y2, _d2]] of _comparedCoords) {
                for (const [x, y, d] of [[x1, y1, d1], [x2, y2, d2]] as [number, number, Direction][]) {
                    if (
                        ((y === _y1 && y === _y2 && isInRange(x, _x1, _x2))
                            || (x === _x1 && x === _x2 && isInRange(y, _y1, _y2)))
                    ) {
                        buffer.push({ gValue: comparedValue, direction: d, edgeDirection })
                    }
                }

            }
        }
    }

    return ALL_DIRECTIONS.reduce((prev, _edgeDirection) => (
        {
            ...prev,
            [_edgeDirection]: buffer.filter(({ edgeDirection }) => edgeDirection === _edgeDirection)
                .map(({ gValue, direction }) => ({ gValue, direction })) as { direction: Direction }[]
        }
    ), {}) as GappedNeighbours;
}

const getEdgeCoords = (gValue: GAbstractValue) => {
    const { unscaledX: x1, unscaledY: y1, unscaledWidth: w = 0, unscaledHeight: h = 0 } = gValue;
    const [x2, y2] = [x1 + w, y1 + h];

    const edges = gValue instanceof GValue ? [gValue.xEdge, gValue.yEdge] : gValue instanceof GSimpleValue ? [gValue.edge] : []
    return edges.map(edge => (
        edge === "top" ? [[x1, y1, 'left'], [x2, y1, 'right'], 'top'] :
            edge === "right" ? [[x2, y1, 'top'], [x2, y2, 'bottom'], 'right'] :
                edge === "bottom" ? [[x1, y2, 'left'], [x2, y2, 'right'], 'bottom'] :
                    edge === "left" ? [[x1, y1, 'top'], [x1, y2, 'bottom'], 'left'] :
                        []
    )) as [[number, number, Direction], [number, number, Direction], Direction][]
}

export default getCommonEdgeValues;