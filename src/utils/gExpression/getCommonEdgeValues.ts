import GExpression from "../../expression/gExpression/GExpression";
import GEquation from "../../expression/gExpression/GEquation";
import GAbstractValue from "../../expression/gExpression/GAbstractValue";
import GProduct1D from "../../expression/gExpression/GProduct1D";
import GQuotient1D from "../../expression/gExpression/GQuotient1D";
import GProduct2D from "../../expression/gExpression/GProduct2D";
import GQuotient2D from "../../expression/gExpression/GQuotient2D";
import GSum from "../../expression/gExpression/GSum";
import GDifference from "../../expression/gExpression/GDifference";
import GTerm from "../../expression/gExpression/GTerm";

import { isOrthogonal, oppositeDirection } from "../general";
import { Direction, CommonEdgeValue } from "../../types";
import { first, flatten, last } from "lodash";

export const getCommonEdgeValues = (expression: GExpression, direction: Direction): CommonEdgeValue[] => {
    const _testDownward = (expression: GExpression | undefined, direction?: Direction, orthDirection?: Direction): CommonEdgeValue[] => {
        if (!expression) return [];

        const parent = expression.parent;
        const typeInParent = expression.typeInParent;
        if (parent instanceof GSum) {
            if (!parent.gSummands?.length) return [];

            const idx = parent.gSummands
                .findIndex(gSummand => gSummand.id === expression.id) || 0;

            if (
                parent.startDirection === oppositeDirection(direction) &&
                idx + 1 < parent.gSummands.length
            ) {
                return _testUpward(
                    parent.gSummands[idx + 1],
                    oppositeDirection(direction) as Direction,
                    orthDirection
                );
            } else if (parent.startDirection === direction && idx > 0) {
                return _testUpward(
                    parent.gSummands[idx - 1],
                    oppositeDirection(direction) as Direction,
                    orthDirection
                );
            }
        }
        else if (parent instanceof GDifference) {
            if (typeInParent === "gMinuend") {
                if (parent.startDirection === oppositeDirection(direction)) {
                    return _testUpward(parent.gSubtrahend, direction, orthDirection);
                } else {
                    return _testDownward(parent, direction, orthDirection);
                }
            } else if (typeInParent === "gSubtrahend") {
                if (parent.startDirection === direction) {
                    return _testDownward(parent, oppositeDirection(direction) as Direction, orthDirection);
                } else {
                    return _testUpward(parent.gMinuend, direction, orthDirection);
                }
            }
        }
        else if (parent instanceof GProduct1D) {
            if (
                typeInParent === "gComplexFactor" &&
                parent.startDirection === oppositeDirection(direction)
            ) {
                return _testUpward(
                    parent.gSimpleFactor,
                    oppositeDirection(direction) as Direction,
                    orthDirection
                );
            } else if (
                typeInParent === "gSimpleFactor" &&
                parent.startDirection === direction
            ) {
                return _testUpward(
                    parent.gComplexFactor,
                    oppositeDirection(direction) as Direction,
                    orthDirection
                );
            } else if (
                ["complexFactor", "simpleFactor"].some(t => t === typeInParent) &&
                isOrthogonal(parent.startDirection, direction)
            ) {
                return [
                    ..._testUpward(parent.gSimpleFactor, direction, orthDirection),
                    ..._testUpward(parent.gComplexFactor, direction, orthDirection),
                    ..._testDownward(parent, direction, orthDirection),
                ];
            }
            return _testDownward(parent, direction, orthDirection);
        }
        else if (parent instanceof GQuotient1D) {
            if (
                ["gComplexDivident", "gSimpleDivisor"].some(t => t === typeInParent) &&
                isOrthogonal(parent.startDirection, direction)
            ) {
                return [
                    ..._testUpward(parent.gComplexDivident, direction, orthDirection),
                    ..._testUpward(parent.gSimpleDivisor, direction, orthDirection),
                    ..._testDownward(parent, direction, orthDirection),
                ];
            } else if (typeInParent === "gComplexDivident") {
                if (parent.startDirection === oppositeDirection(direction)) {
                    return _testUpward(parent.gSimpleDivisor, direction, orthDirection);
                } else {
                    return _testDownward(parent, direction, orthDirection);
                }
            } else if (typeInParent === "gSimpleDivisor") {
                if (parent.startDirection === direction) {
                    return _testDownward(parent, oppositeDirection(direction) as Direction, orthDirection);
                } else {
                    return _testUpward(parent.gComplexDivident, direction, orthDirection);
                }
            }
        }
        else if (parent instanceof GProduct2D) {
            if (
                (typeInParent === "gFactorX" &&
                    parent.xEdge === oppositeDirection(direction)) ||
                (typeInParent === "gFactorY" &&
                    parent.yEdge === oppositeDirection(direction))
            ) {
                return _testDownward(parent, oppositeDirection(direction) as Direction, orthDirection);
            } else if (
                typeInParent === "gFactorX" &&
                isOrthogonal(parent.xEdge, direction)
            ) {
                return _testDownward(parent, parent.xEdge, direction);
            } else if (
                typeInParent === "gFactorY" &&
                isOrthogonal(parent.yEdge, direction)
            ) {
                return _testDownward(parent, parent.yEdge, direction);
            }
        }
        else if (parent instanceof GQuotient2D) {
            if (typeInParent === "gDivident" && parent.divisorEdge === direction) {
                return [
                    ..._testUpward(parent.gDivisor, oppositeDirection(direction) as Direction, orthDirection),
                    ..._testDownward(parent, direction, orthDirection),
                ];
            } else if (typeInParent === "gDivisor") {
                if (isOrthogonal(parent.divisorEdge, direction)) {
                    return _testDownward(parent, parent.divisorEdge, direction);
                } else if (parent.divisorEdge === oppositeDirection(direction)) {
                    return _testUpward(
                        parent.gDivident,
                        oppositeDirection(direction) as Direction,
                        orthDirection
                    );
                }
            }
        }
        else if (parent instanceof GEquation) {
            let otherTerm = (typeInParent === "gTerm1" ? "term2" : "gTerm1") as ('gTerm1' | 'gTerm2');
            return _testUpward(parent[otherTerm], direction, orthDirection);
        }
        else if (parent instanceof GTerm) {

        }
        return []
    }
    const _testUpward = (expression: GExpression | undefined, direction?: Direction, orthDirection?: Direction): CommonEdgeValue[] => {
        if (!expression || !direction) return [];
        if (expression instanceof GAbstractValue) { return [{ gValue: expression, direction }] }
        else if (expression instanceof GSum) {
            if (expression.startDirection === direction) {
                return _testUpward(first(expression.gSummands), direction, orthDirection);
            } else if (expression.startDirection === oppositeDirection(direction)) {
                return _testUpward(last(expression.gSummands), direction, orthDirection);
            }
            return flatten(
                (expression.gSummands?.map((summand) => _testUpward(summand, direction, orthDirection)) || [])
            );
        }
        else if (expression instanceof GDifference) {
            if (expression.startDirection === oppositeDirection(direction)) {
                return _testUpward(
                    expression.gSubtrahend,
                    oppositeDirection(direction) as Direction,
                    orthDirection
                );
            } else return _testUpward(expression.gMinuend, direction, orthDirection);
        }
        else if (expression instanceof GProduct1D) {
            if (expression.startDirection === direction) {
                return _testUpward(expression.gComplexFactor, direction, orthDirection);
            } else if (expression.startDirection === oppositeDirection(direction)) {
                return _testUpward(expression.gSimpleFactor, direction, orthDirection);
            }
            return [
                ..._testUpward(expression.gComplexFactor, direction, orthDirection),
                ..._testUpward(expression.gSimpleFactor, direction, orthDirection),
            ];
        }
        else if (expression instanceof GQuotient1D) {
            if (expression.startDirection === oppositeDirection(direction)) {
                return _testUpward(
                    expression.gSimpleDivisor,
                    oppositeDirection(direction) as Direction,
                    orthDirection
                );
            } else
                return _testUpward(expression.gComplexDivident, direction, orthDirection);
        }
        else if (expression instanceof GProduct2D) {
            if (expression.xEdge === direction) {
                if (!!orthDirection)
                    return _testUpward(expression.gFactorX, orthDirection);
                return _testUpward(
                    expression.gFactorX,
                    oppositeDirection(direction) as Direction,
                    orthDirection
                );
            }
            if (expression.yEdge === direction) {
                if (!!orthDirection)
                    return _testUpward(expression.gFactorY, orthDirection);
                return _testUpward(
                    expression.gFactorY,
                    oppositeDirection(direction) as Direction,
                    orthDirection
                );
            }
        }
        else if (expression instanceof GQuotient2D) {
            if (expression.divisorEdge === direction && !!orthDirection) {
                return _testUpward(expression.gDivisor, orthDirection);
            }
            if (expression.resultEdge === oppositeDirection(direction))
                return _testUpward(
                    expression.gDivident,
                    oppositeDirection(direction) as Direction,
                    orthDirection
                );
        }

        return [];
    }

    return [..._testDownward(expression, direction), ..._testUpward(expression, direction)]
        .filter(_expression => expression.id !== _expression.gValue.id)
}

export default getCommonEdgeValues;