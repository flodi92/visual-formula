import { GDifference, GExpression, GProduct1D, GProduct2D, GQuotient1D, GQuotient2D, GSum } from '../expression/gExpression';
import { directionToXY } from '../utils/general';
import AbstractDraw, { InteractionProps } from './AbstractDraw';
import { ID, Operator } from '../types'

abstract class AbstractDrawOperators<T> extends AbstractDraw<T, GExpression> {
    protected abstract renderOperator(
        { id, operatorPositions, operator }: {
            id?: ID,
            operatorPositions: [number, number][],
            operator: Operator,
            isTerm1: boolean | undefined;
        },
        props: InteractionProps): T;

    public render(props: InteractionProps): T {

        let operatorPositions: [number, number][] | undefined;
        let operator: Operator | undefined;
        if (this.gExpression instanceof GSum && !!this.gExpression.gSummands && this.gExpression.startDirection) {
            const { gSummands, x, y, width, height, startDirection } = this.gExpression;

            if (directionToXY(startDirection) === 'X') {
                const _y = y + .5 * height;

                operatorPositions =
                    ((startDirection === "left") ?
                        gSummands.filter((_, idx) => idx !== 0).map(({ x }) => [x, _y]) :
                        gSummands.filter((_, idx, { length }) => idx !== length - 1).map(({ x }) => [x, _y]));
            } else { // ... ='Y'
                const _x = x + .5 * width;

                operatorPositions =
                    ((startDirection === "top") ?
                        gSummands.filter((_, idx) => idx !== 0).map(({ y }) => [_x, y]) :
                        gSummands.filter((_, idx, { length }) => idx !== length - 1).map(({ y }) => [_x, y]));
            }
            operator = '+';
        } else if (this.gExpression instanceof GDifference && !!this.gExpression.gSubtrahend && this.gExpression.startDirection) {
            const { gSubtrahend: { x, y, width, height, }, startDirection } = this.gExpression;

            operatorPositions =
                startDirection === 'top' ? [[x + .5 * width, y]]
                    : startDirection === 'right' ? [[x + width, y + .5 * height]]
                        : startDirection === 'bottom' ? [[x + .5 * width, y + height]]
                            :/*  startDirection === 'left' ? */[[x, y + .5 * height]];
            operator = '-';
        } else if (this.gExpression instanceof GProduct1D && !!this.gExpression.gSimpleFactor && this.gExpression.startDirection) {
            const { gSimpleFactor: { x, y, width, height, }, startDirection } = this.gExpression;

            operatorPositions =
                startDirection === 'top' ? [[x + .5 * width, y]]
                    : startDirection === 'right' ? [[x + width, y + .5 * height]]
                        : startDirection === 'bottom' ? [[x + .5 * width, y + height]]
                            :/*  startDirection === 'left' ? */[[x, y + .5 * height]];
            operator = '*';
        } else if (this.gExpression instanceof GQuotient1D && !!this.gExpression.gSimpleDivisor && this.gExpression.startDirection) {
            const { gSimpleDivisor: { x, y, width, height, }, startDirection } = this.gExpression;

            operatorPositions =
                startDirection === 'top' ? [[x + .5 * width, y + height]]
                    : startDirection === 'right' ? [[x, y + .5 * height]]
                        : startDirection === 'bottom' ? [[x + .5 * width, y]]
                            : /* startDirection === 'left' ? */[[x + width, y + .5 * height]];
            operator = '/';
        } else if (this.gExpression instanceof GProduct2D) {
            const { x, y, width, height, yEdge, xEdge } = this.gExpression;

            const _x = yEdge === 'left' ? x : x + width;
            const _y = xEdge === 'top' ? y : y + height;

            operatorPositions = [[_x, _y]];
            operator = '*';
        } else if (this.gExpression instanceof GQuotient2D && this.gExpression.gDivident) {
            const { gDivident: { x, y, width, height }, resultEdge, divisorEdge } = this.gExpression;

            const [xEdge, yEdge] = directionToXY(resultEdge) === "X" ? [divisorEdge, resultEdge] : [resultEdge, divisorEdge];

            const _x = yEdge === 'left' ? x : x + width;
            const _y = xEdge === 'top' ? y : y + height;

            operatorPositions = [[_x, _y]];
            operator = '/';
        }

        if (!!operatorPositions && !!operator) {
            return this.renderOperator({ id: this.gExpression.id, operatorPositions, operator, isTerm1: this.gExpression.isTerm1 }, props)
        }

        return this._empty();
    }
}

export default AbstractDrawOperators;