import { GAbstractValue } from "../../expression/gExpression";
import { ALL_DIRECTIONS, Direction, GappedNeighbour, GappedNeighbours } from "../../types";
import { expressionToArray, getRoot } from "../expression";
import { isInRange } from "../general";
import getEdgeCoords from "./getEdgeCoords";

 const getGappedNeighbours = (expression: GAbstractValue): GappedNeighbours => {
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

export default getGappedNeighbours;