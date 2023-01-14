import {
    GAbstractValue, GExpression
} from "../../expression/gExpression";

import { CommonEdgeValue, Direction } from "../../types";
import { expressionToArray, getRoot } from "../expression";
import { isIntersection } from "../general";


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
}

export default getCommonEdgeValues;