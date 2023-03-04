import GAbstractValue from "../expression/gExpression/GAbstractValue";
import GSimpleValue from '../expression/gExpression/GSimpleValue';
import GValue from '../expression/gExpression/GValue';

import { zip } from 'lodash';
import { MExpression } from '../expression/mExpression';
import { ID } from '../types';

import { getGappedNeighbours } from "../utils/gExpression/getCommonEdgeValues";
import AbstractDraw, { InteractionProps } from './AbstractDraw';
import { EDGE_END_GAP, GVALUE_RADIUS, NORM_STROKE_WIDHT, STANDARD_STROKE_WIDHT } from "./config";

abstract class AbstractDrawValue<T> extends AbstractDraw<T, GAbstractValue> {
    protected abstract _renderRoundGValue(vals:
        {
            id: ID,
            coords: { a: [number, number], ba: [number, number], b: [number, number], bc: [number, number], c: [number, number] },
            strokeWidth: number,
            isTerm1: boolean | undefined
        }, props: InteractionProps): T;
    protected abstract _renderNormedGValue(vals: {
        id: ID,
        coords: { a: [number, number], ab: [number, number], bc: [number, number], c: [number, number], },
        abStrokeWidth: number,
        bcStrokeWidth: number,
        isTerm1: boolean | undefined,
    }, props: InteractionProps): T;

    protected renderGValue(gValue: GValue, props: InteractionProps): T {
        if (!this.gExpression) return this._empty();
        const { x, y, width, height } = this.gExpression
        const [xEdge, yEdge] = [gValue.xEdge, gValue.yEdge];

        const xNorm = gValue.isNormX;
        const yNorm = gValue.isNormY;

        const {
            gapTopLeft,
            gapTopRight,
            gapBottomLeft,
            gapBottomRight,
            gapLeftTop,
            gapLeftBottom,
            gapRightTop,
            gapRightBottom,
        } = this.computeGaps(gValue)

        const [a, b, c] =
            (
                (xEdge === "top" && yEdge === "left")
                    ? [
                        [x, y + height - gapLeftBottom],
                        [x, y],
                        [x + width - gapTopRight, y],
                    ] :
                    (xEdge === "bottom" && yEdge === "left")
                        ? [
                            [x, y + gapLeftTop],
                            [x, y + height],
                            [x + width - gapBottomRight, y + height],
                        ] :
                        (xEdge === "bottom" && yEdge === "right")
                            ? [
                                [x + width, y + gapRightTop],
                                [x + width, y + height],
                                [x + gapBottomLeft, y + height],
                            ] :
                            (xEdge === "top" && yEdge === "right")
                                ? [
                                    [x + gapTopLeft, y],
                                    [x + width, y],
                                    [x + width, y + height - gapRightBottom],
                                ] :
                                []) as [number, number][]

        if (!a || !b || !c || !this.gExpression.id) return this._empty();
        const ba = zip(b, a).map(
            ([_b, _a]) => _b as number + Math.sign(_a as number - (_b as number)) * GVALUE_RADIUS
        ) as [number, number];
        const bc = zip(b, c).map(
            ([_b, _c]) => _b as number + Math.sign(_c as number - (_b as number)) * GVALUE_RADIUS
        ) as [number, number];
        if (!xNorm && !yNorm && !!a && !!ba && !!b && !!bc && !!c) {
            return this._renderRoundGValue({
                id: this.gExpression.id,
                strokeWidth: STANDARD_STROKE_WIDHT,
                isTerm1: gValue.isTerm1,
                coords: { a, ba, b, bc, c }
            }, props)
        } else {
            const isABNorm = (a[0] === b[0] && yNorm) || (a[1] === b[1] && xNorm);
            const isBCNorm = (b[0] === c[0] && yNorm) || (b[1] === c[1] && xNorm);

            const abStrokeWidth = isABNorm ? NORM_STROKE_WIDHT : STANDARD_STROKE_WIDHT;
            const bcStrokeWidth = isBCNorm ? NORM_STROKE_WIDHT : STANDARD_STROKE_WIDHT;

            const adjustCorner = (j: [number, number], k: [number, number], delta: number) => {

                return [[j[0], k[0]], [j[1], k[1]]]
                    .map(([j, k]) => j === k ? k : k + Math.sign(k - j) * delta) as [number, number];

            }

            const ab = adjustCorner(a, b, bcStrokeWidth * 0.5);
            const bc = adjustCorner(c, b, -abStrokeWidth * 0.5);

            return this._renderNormedGValue({
                id: this.gExpression.id,
                abStrokeWidth,
                bcStrokeWidth,
                isTerm1: gValue.isTerm1,
                coords: { a, ab, bc, c },
            }, props);
        }
    }

    protected abstract _renderGSimpleValue(vals: {
        id: ID,
        coords: { x1: number, y1: number, x2: number, y2: number },
        strokeWidth: number,
        isTerm1: boolean | undefined,
    }, props: InteractionProps): T;

    protected renderGSimpleValue(gValue: GSimpleValue, props: InteractionProps): T {
        if (!this.gExpression) return this._empty();
        const { x, y, width, height } = this.gExpression;
        const edge = gValue.edge;

        const {
            gapTopLeft,
            gapTopRight,
            gapBottomLeft,
            gapBottomRight,
            gapLeftTop,
            gapLeftBottom,
            gapRightTop,
            gapRightBottom,
        } = this.computeGaps(gValue)

        const [x1, y1, x2, y2] =
            edge === "top" ? [x + gapTopLeft, y, x + width - gapTopRight, y]
                : edge === "bottom" ? [x + gapBottomLeft, y + height, x + width - gapBottomRight, y + height]
                    : edge === "left" ? [x, y + gapLeftTop, x, y + height - gapLeftBottom]
                        : edge === "right" ? [x + width, y + gapRightTop, x + width, y + height - gapRightBottom]
                            : []

        if (!x1 || !y1 || !x2 || !y2 || !this.gExpression.id) return this._empty();
        return this._renderGSimpleValue(
            {
                id: this.gExpression.id,
                coords: { x1, y1, x2, y2 },
                strokeWidth: STANDARD_STROKE_WIDHT,
                isTerm1: gValue.isTerm1,
            }, props);
    }

    private computeGaps(gValue: GAbstractValue) {
        const gappedNeighbours = getGappedNeighbours(gValue);

        const gapTopLeft = gappedNeighbours.top?.some(({ direction }) => direction === "left") ? EDGE_END_GAP : 0;
        const gapTopRight = gappedNeighbours.top?.some(({ direction }) => direction === "right") ? EDGE_END_GAP : 0;
        const gapBottomLeft = gappedNeighbours.bottom?.some(({ direction }) => direction === "left") ? EDGE_END_GAP : 0;
        const gapBottomRight = gappedNeighbours.bottom?.some(({ direction }) => direction === "right") ? EDGE_END_GAP : 0;

        const gapLeftTop = gappedNeighbours.left?.some(({ direction }) => direction === "top") ? EDGE_END_GAP : 0;
        const gapLeftBottom = gappedNeighbours.left?.some(({ direction }) => direction === "bottom") ? EDGE_END_GAP : 0;
        const gapRightTop = gappedNeighbours.right?.some(({ direction }) => direction === "top") ? EDGE_END_GAP : 0;
        const gapRightBottom = gappedNeighbours.right?.some(({ direction }) => direction === "bottom") ? EDGE_END_GAP : 0;

        return {
            gapTopLeft,
            gapTopRight,
            gapBottomLeft,
            gapBottomRight,
            gapLeftTop,
            gapLeftBottom,
            gapRightTop,
            gapRightBottom,
        }
    }

    protected abstract _renderMExpression(mExpression: MExpression | undefined, props: InteractionProps): T;
    protected abstract _renderMValueInGValue(gValue: GAbstractValue, props: InteractionProps): T;
}

export default AbstractDrawValue;