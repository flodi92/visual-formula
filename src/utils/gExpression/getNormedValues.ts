import Expression from "../../expression/Expression";
import { GAbstractDirectedExpression, GAbstractValue, GEquation, GExpression, GProduct2D, GQuotient2D, GTerm } from "../../expression/gExpression";
import { ID, XY } from "../../types";
import { directionToXY, getOtherXY } from "../general";

const getNormedValues = (gExpression: GExpression | undefined, xy: XY): GAbstractValue[] => {
    let visitedIDs: ID[] = [];

    const _down = (gExpression: GExpression | undefined, isNormed = false): GAbstractValue[] => {
        if (!gExpression?.id || visitedIDs.includes(gExpression.id)) return [];
        visitedIDs.push(gExpression.id);

        if (gExpression instanceof GAbstractValue) {
            return isNormed ? [gExpression] : [];
        } else if (gExpression instanceof GProduct2D) {
            if (xy === "X") {
                return !!gExpression?.gFactorY ? _down(gExpression.gFactorY, true) : [];
            } else { // xy === "Y"
                return !!gExpression?.gFactorX ? _down(gExpression.gFactorX, true) : [];
            }
        } else if (gExpression instanceof GQuotient2D) {
            return (
                directionToXY(gExpression.divisorEdge) === (xy) ?
                    _down(gExpression.gDivisor, true) :
                    directionToXY(gExpression.resultEdge) === getOtherXY(xy)
                        ? _up(gExpression.parent) :
                        []);
        } else if (gExpression instanceof GAbstractDirectedExpression) {
            const areChildrenNormed = directionToXY(gExpression.startDirection) === getOtherXY(xy) && isNormed;
            return areChildrenNormed || !isNormed ?
                (gExpression.children as (GExpression | undefined)[])
                    .map((child) => _down(child, areChildrenNormed))
                    .reduce((prev, current) => [...prev, ...current], [])
                : []
        } else if (gExpression instanceof GEquation) {
            return [..._down(gExpression.gTerm1, isNormed), ..._down(gExpression.gTerm2, isNormed)]
        } else if (gExpression instanceof GTerm) {
            return _down(gExpression.gTerm);
        }
        return [];
    }

    const _up = (gExpression: Expression | undefined): GAbstractValue[] => {
        if (!gExpression?.id || !(gExpression instanceof GExpression)) return [];
        return [..._down(gExpression, true), ..._up(gExpression.parent)]; // TODO debug won't work for nested GQuotient2D
    }

    return _down(gExpression)
}

export const getXNormedValues = (gExpression: GExpression): GAbstractValue[] => {
    return getNormedValues(gExpression, 'X');
}

export const getYNormedValues = (gExpression: GExpression): GAbstractValue[] => {
    return getNormedValues(gExpression, 'Y');
}