import {
    GExpression,
    GEquation,
    GAbstractValue,
    GProduct1D,
    GQuotient1D,
    GProduct2D,
    GQuotient2D,
    GSum,
    GDifference,
    GTerm
} from "../../expression/gExpression"

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
            } else {
                return _testUpward(parent, direction, orthDirection);
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
            } else {
                return _testUpward(parent, direction, orthDirection);
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
            } else {
                return _testUpward(parent, direction, orthDirection)
            }
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
            } else {
                return _testUpward(parent, direction, orthDirection)
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
        let childrenUpward: CommonEdgeValue[] = [];
        let upward: CommonEdgeValue[] = [];
        if (expression instanceof GAbstractValue) { return [{ gValue: expression, direction }] }
        else if (expression instanceof GSum) {
            childrenUpward = (expression.startDirection === direction) ?
                _testUpward(first(expression.gSummands), direction, orthDirection)
                : (expression.startDirection === oppositeDirection(direction)) ?
                    _testUpward(last(expression.gSummands), direction, orthDirection)
                    : flatten(
                        (expression.gSummands?.map((summand) => _testUpward(summand, direction, orthDirection)) || [])
                    )
        }
        else if (expression instanceof GDifference) {
            childrenUpward = expression.startDirection === oppositeDirection(direction) ?
                _testUpward(expression.gSubtrahend, oppositeDirection(direction) as Direction, orthDirection) :
                _testUpward(expression.gMinuend, direction, orthDirection)
        }
        else if (expression instanceof GProduct1D) {
            childrenUpward = (expression.startDirection === direction) ?
                _testUpward(expression.gComplexFactor, direction, orthDirection) :
                (expression.startDirection === oppositeDirection(direction)) ?
                    _testUpward(expression.gSimpleFactor, direction, orthDirection) : [
                        ..._testUpward(expression.gComplexFactor, direction, orthDirection),
                        ..._testUpward(expression.gSimpleFactor, direction, orthDirection),
                    ]
        }
        else if (expression instanceof GQuotient1D) {
            childrenUpward = (expression.startDirection === oppositeDirection(direction)) ?
                _testUpward(expression.gSimpleDivisor, oppositeDirection(direction) as Direction, orthDirection) :
                _testUpward(expression.gComplexDivident, direction, orthDirection)
        }
        else if (expression instanceof GProduct2D) {
            if (expression.xEdge === direction) {
                if (!!orthDirection) {
                    childrenUpward = _testUpward(expression.gFactorX, orthDirection);
                }
                childrenUpward = _testUpward(
                    expression.gFactorX,
                    oppositeDirection(direction) as Direction,
                    orthDirection
                );
            }
            if (expression.yEdge === direction) {
                if (!!orthDirection) {
                    childrenUpward = _testUpward(expression.gFactorY, orthDirection);
                }
                childrenUpward = _testUpward(
                    expression.gFactorY,
                    oppositeDirection(direction) as Direction,
                    orthDirection
                );
            }
        }
        else if (expression instanceof GQuotient2D) {
            if (expression.divisorEdge === direction) {
                childrenUpward = !!orthDirection ?
                    _testUpward(expression.gDivisor, orthDirection) :
                    _testUpward(expression.gDivisor, oppositeDirection(direction));
            }
            if (expression.resultEdge === oppositeDirection(direction))
                childrenUpward = !!orthDirection ?
                    _testUpward(expression.gDivident, orthDirection) :
                    _testUpward(expression.gDivident, oppositeDirection(direction));
        }

        upward = _testUpward(expression.parent as GExpression, direction);

        return [...childrenUpward, ...upward];
    }


    const ret = [..._testDownward(expression, direction), ..._testUpward(expression, direction)]
        .filter(_expression => expression.id !== _expression.gValue.id)

    return ret;
}

export default getCommonEdgeValues;