
import GExpression from "../../expression/gExpression/GExpression";
import GEquation from "../../expression/gExpression/GEquation";
import GAbstractDirectedExpression from "../../expression/gExpression/GAbstractDirectedExpression";
import GSimpleValue from "../../expression/gExpression/GSimpleValue";
import GProduct2D from "../../expression/gExpression/GProduct2D";
import GQuotient2D from "../../expression/gExpression/GQuotient2D";
import GValue from "../../expression/gExpression/GValue";

import { directionToXY, getOtherXY, } from "../general";
import { XY, } from "../../types";

import {
    flatten,
} from 'lodash';

 const getNeighbours = (expression: GExpression | undefined, xy: XY) => {
    const _getNeighbours = (expression: GExpression | undefined, visited = Array<number>()) => {
        if (!expression?.id || visited.includes(expression.id)) return [];
        visited.push(expression.id);
        let buffer = new Array<GExpression>();
        let isCheckParent = false;

        if (expression instanceof GValue || expression instanceof GSimpleValue) {
            buffer.push(expression);
            isCheckParent = true;
        } else if (
            expression instanceof GAbstractDirectedExpression
        ) {
            if (directionToXY(expression.startDirection) === xy) {
                buffer.push(
                    ...flatten(
                        expression
                            .children
                            .map((child) => _getNeighbours(child as GExpression | undefined, visited))
                    )
                );
                isCheckParent = true;
            } else {
                buffer.push(expression); // do not check children
                isCheckParent = false;
            }
        } else if (expression instanceof GProduct2D) {
            buffer.push(
                ..._getNeighbours(expression[`factor${getOtherXY(xy)}`](), visited)
            );
            isCheckParent = false;
        } else if (expression instanceof GEquation) {
            buffer.push(
                ..._getNeighbours(expression.gTerm1, visited),
                ..._getNeighbours(expression.gTerm2, visited)
            );
        }

        // parent GProduct2D
        if (
            (expression.typeInParent === "gFactorX" && xy === "Y") ||
            (expression.typeInParent === "gFactorY" && xy === "X")
        ) {
            isCheckParent = false;
        }
        // parent GQuotient2D
        else if (
            expression.parent instanceof GQuotient2D &&
            directionToXY(expression.parent.divisorEdge) === xy
        ) {
            buffer.push(
                ..._getNeighbours(expression.parent.gDivisor, visited),
                ..._getNeighbours(expression.parent.gDivident, visited)
            );
        }

        isCheckParent &&
            buffer.push(..._getNeighbours(expression.parent as GExpression | undefined,
                visited));

        return buffer;
    };

    return _getNeighbours(expression);
}


export default getNeighbours;
