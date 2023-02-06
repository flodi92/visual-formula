import { GAbstractRoot, GEquation, GExpression } from '../expression/gExpression';
import AbstractDraw from './AbstractDraw';
import { ZERO_RADIUS } from './config';

abstract class AbstractDrawZeros<T> extends AbstractDraw<T, GAbstractRoot> {
    protected abstract renderZero(vals: { x: number, y: number, r: number, isTerm1: boolean }): T;

    protected abstract _empty(): T;

    public render(): T {
        if (!this.gEquation) return this._empty();

        const { gTerm1, gTerm2 } = this.gEquation || {}; 

        const [gTerm, _12] = (!gTerm1 && !!gTerm2) ? [gTerm2, 1]
            : (!gTerm2 && !!gTerm1) ? [gTerm1, 2]
                : []

        if (!gTerm || !(gTerm instanceof GExpression)) return this._empty();

        const [x, y] = gTerm.width === 0 ?
            [gTerm.x, gTerm.y + gTerm.height / 2]
            : [gTerm.x + gTerm.width / 2, gTerm.y];

        return this.renderZero({ x, y, r: ZERO_RADIUS, isTerm1: (_12 === 1) })
    }

    public get gEquation(): GEquation | undefined {
        return this.gExpression && this.gExpression instanceof GEquation ? this.gExpression : undefined;
    }

    public get gRoot(): GAbstractRoot | undefined {
        return this.gExpression;
    }
}

export default AbstractDrawZeros;