import GExpression from "../../expression/gExpression/GExpression";
import GAbstractValue from "../../expression/gExpression/GAbstractValue";
import GProduct2D from "../../expression/gExpression/GProduct2D";
import GValue from "../../expression/gExpression/GValue";
import GSimpleValue from "../../expression/gExpression/GSimpleValue";

import { Direction } from "../../types";
import { getCommonEdgeValues, getGValues } from ".";


const isEdgePossible = (expression: GExpression, direction: Direction) => {
    if (expression instanceof GAbstractValue) {
        return getCommonEdgeValues(expression, direction).every(
            ({ gValue, direction }) => {
                const edges =
                    (gValue instanceof GValue)
                        ? [gValue.xEdge, gValue.yEdge]
                        : (gValue instanceof GSimpleValue)
                            ? [gValue.edge]
                            : [];
                return edges.every((edge) => edge !== direction);
            }
        );
    } else if (expression instanceof GProduct2D) {
        let neighbours = getCommonEdgeValues(expression, direction).map(
            ({ gValue }) => gValue
        );
        let childrenIds = getGValues(expression).map((gValue) => gValue.id);
        neighbours = neighbours.filter(
            (neighbour) => !childrenIds.includes(neighbour.id)
        );
        return neighbours.every((gValue) =>
            ["left", "right"].includes(direction)
                ? !gValue.isNormX
                : !gValue.isNormY
        );
    } else if (expression instanceof GProduct2D) {
        // TODO GQuotient2D
    } else {
        return true;
    }
};

export default isEdgePossible;