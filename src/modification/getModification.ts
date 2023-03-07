import Expression from "../expression/Expression";
import { GEquation, GExpression, GProduct2D, GSimpleValue, GSum, GValue } from "../expression/gExpression";
import { ID, XY } from "../types";
import { expressionToArray } from "../utils/expression";
import Modification from "./Modification";
import { MoveDivisor, MoveFactor, MoveSubtrahend, MoveSummand } from "./modifyEquation";
import { SwapSummands, SwapFactors1D, SwapFactors2D } from "./modifyTerm";
import { Reverse } from "./reconfigTerm";

const getModification = (
    { selectedExpression, isDragSelected, isDragResult, dropExpressions, isDropSelected, isDropResult, dragExpressions, dragXY }:
        {
            selectedExpression?: Expression,
            isDragSelected?: boolean,
            isDragResult?: boolean,
            dropExpressions?: GExpression[],

            isDropSelected?: boolean,
            isDropResult?: boolean,
            dragExpressions?: GExpression[],

            dragXY?: XY,
        }
): Modification | undefined => {
    const { id: idA, parent, typeInParent: selectedTypeInParent } = selectedExpression || {};

    if (selectedExpression?.id !== undefined && isDragSelected && isDropSelected) {
        return {
            type: "reverse",
            id: selectedExpression.id,
            xy: dragXY,
        } as Reverse
    }

    if (parent?.id !== undefined) {
        let { id: idB } = (dropExpressions || []).find(expression => (parent?.id === expression.parent?.id)) || {};

        if (idB !== undefined) {
            if (selectedTypeInParent === "gSummand") {
                const gSummands = (<GSum>parent).gSummands as GExpression[];
                return {
                    type: "swapSummands",
                    id: parent.id,
                    indexA: gSummands.findIndex(gSummand => gSummand.id === idA) as number,
                    indexB: gSummands.findIndex(gSummand => gSummand.id === idB) as number
                } as SwapSummands
            } else if (selectedTypeInParent === "gFactorX" || selectedTypeInParent === "gFactorY") {
                return {
                    type: "swapFactors2D",
                    id: parent.id
                } as SwapFactors2D
            } else if (selectedTypeInParent === "gComplexFactor" || selectedTypeInParent === "gSimpleFactor") {
                return {
                    type: "swapFactors1D",
                    id: parent.id
                } as SwapFactors1D
            }
        }
    }

    if (isDragSelected
        && !!selectedExpression

        && ((!!dropExpressions?.length
            && dropExpressions?.every(expression => expression.isTerm1 !== selectedExpression?.isTerm1))
            || (isDropResult && !isDragResult))
    ) {
        let { id: movedId, typeInParent: movedTypeInParent } = selectedExpression;

        if (movedTypeInParent === "gSummand") {
            return {
                type: "moveSummand",
                id: movedId,
            } as MoveSummand
        } else if (movedTypeInParent === "gSubtrahend") {
            return {
                type: "moveSubtrahend",
                id: movedId,
            } as MoveSubtrahend
        } else if (movedTypeInParent === "gFactorX" || movedTypeInParent === "gFactorY" ||
            movedTypeInParent === "gSimpleFactor" || movedTypeInParent === "gComplexFactor") {
            return {
                type: "moveFactor",
                id: movedId,
            } as MoveFactor
        } else if (movedTypeInParent === "gDivisor" || movedTypeInParent === "gSimpleDivisor") {
            return {
                type: "moveDivisor",
                id: movedId,
            } as MoveDivisor
        }
    }

    return undefined;
}

export default getModification;