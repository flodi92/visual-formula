
import { GAbstractValue } from "../../expression/gExpression";
import { ALL_DIRECTIONS, Direction } from "../../types";
import { expressionToArray, getRoot } from "../expression";
import { isIntersection } from "../general";
import getEdgeCoords from "./getEdgeCoords";

const getPossibleEdges = (expression: GAbstractValue): Direction[] => {
    const buffer: Direction[] = [];

    const root = getRoot(expression);

    const comparedValues = expressionToArray(root)
        .filter(_expression => _expression instanceof GAbstractValue && _expression.id !== expression.id) as GAbstractValue[];

    const coords = getEdgeCoords(expression, true);
    
    for (const comparedValue of comparedValues) {
        const _comparedCoords = getEdgeCoords(comparedValue);
        for (const [[x1, y1], [x2, y2], edgeDirection] of coords) {
            for (const [[_x1, _y1], [_x2, _y2], _edgeDirection] of _comparedCoords) {
                if (
                    (y1 === y2 && y1 === _y1 && y2 === _y2 && isIntersection(x1, x2, _x1, _x2))
                    || (x1 === x2 && x1 === _x1 && x2 === _x2 && isIntersection(y1, y2, _y1, _y2))
                ) {
                    buffer.push(edgeDirection);
                }
            }
        }
    }

    return ALL_DIRECTIONS.filter(direction => buffer.every(_direction => direction !== _direction))
}

export default getPossibleEdges;