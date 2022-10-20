import Expression from "../Expression";
import { getWidths, getHeights, } from "../../utils/gExpression";
import { DEFAULT_TRANSFORMATION, Transformation, TypeInParent } from "../../types";
import GEquation from "./GEquation";

export default abstract class GExpression extends Expression {
    public get x(): number {
        return this.unscaledX * this.transformation.scaleX + this.transformation.x;
    }
    public get y(): number {
        return this.unscaledY * this.transformation.scaleY + this.transformation.y;
    }
    public get width(): number {
        return this.unscaledWidth * this.transformation.scaleX;
    }
    public get height(): number {
        return this.unscaledHeight * this.transformation.scaleY;
    }

    public get transformation(): Transformation {
        const { x: x1, y: y1, scaleX: scaleX1, scaleY: scaleY1 } = this.layerTransformation;
        const { x: x2, y: y2, scaleX: scaleX2, scaleY: scaleY2 } = (this.parent as GExpression)?.transformation || DEFAULT_TRANSFORMATION;
        return { x: x1 + scaleX1 * x2, y: y1 + scaleY1 * y2, scaleX: scaleX1 * scaleX2, scaleY: scaleY1 * scaleY2 }
    }

    public get layerTransformation(): Transformation {
        if (!(this.parent instanceof GEquation) || !this.parent.gTerm1 || !this.parent.gTerm2) return DEFAULT_TRANSFORMATION;

        const [gTerm1, gTerm2] = [this.parent.gTerm1, this.parent.gTerm2];
        const [x, y] = [gTerm1?.unscaledX, gTerm1?.unscaledY]

        let scaleX: number, scaleY: number;
        if (this === gTerm1) {
            scaleX = (gTerm1.unscaledWidth < gTerm2.unscaledWidth) ? 1 : gTerm2.unscaledWidth / gTerm1.unscaledWidth
            scaleY = (gTerm1.unscaledHeight < gTerm2.unscaledHeight) ? 1 : gTerm2.unscaledHeight / gTerm1.unscaledHeight
        } else { // if (this === gTerm2)
            scaleX = (gTerm2.unscaledWidth < gTerm1.unscaledWidth) ? 1 : gTerm1.unscaledWidth / gTerm2.unscaledWidth
            scaleY = (gTerm2.unscaledHeight < gTerm1.unscaledHeight) ? 1 : gTerm1.unscaledHeight / gTerm2.unscaledHeight
        }

        return { x, y, scaleX, scaleY }
    }

    abstract get unscaledWidth(): number;
    abstract get unscaledHeight(): number;

    get unscaledX(): number {
        if (!this.typeInParent) return 0;

        const [getLefts, getOfParentX] = this.typeInParent ? {
            gSummand: ["getLeftSummands", "unscaledX"],
            gMinuend: [null, "gMinuendX"],
            gSubtrahend: [null, "gSubtrahendX"],
            gFactorX: [null, 'gFactorXX'],
            gFactorY: [null, 'gFactorYX'],
            gComplexFactor: [null, 'gComplexFactorX'],
            gSimpleFactor: [null, 'gSimpleFactorX'],
            gDivident: [null, 'gDividentX'],
            gDivisor: [null, 'gDivisorX'],
            gComplexDivident: [null, 'gComplexDividentX'],
            gSimpleDivisor: [null, 'gSimpleDivisorX'],
            gTerm1: [null, null],
            gTerm2: [null, null],
            gTerm: [null, null],
            mValue: [null, null],
            mSimpleValue:[null, null],
            mSummand: [null, null],
            mMinuend: [null, null],
            mSubtrahend: [null, null],
            mFactor: [null, null],
            mDivident: [null, null],
            mDivisor: [null, null],
            mTerm1: [null, null],
            mTerm2: [null, null],
            mTerm: [null, null],
        }[this.typeInParent as TypeInParent] : [undefined, undefined]
        const parent = this?.parent as Expression;

        const dX = getLefts ? getWidths(parent[getLefts](this)).map((prev, val) => prev + val, 0) : 0;
        const dWidth = getOfParentX ? parent[getOfParentX] : 0;
        return dX + dWidth;
    }
    get unscaledY(): number {
        if (!this.typeInParent) return 0;

        const [getTops, getOfParentY] = this.typeInParent ? {
            gSummand: ["getRightSummands", "unscaledY"],
            gMinuend: [null, "gMinuendY"],
            gSubtrahend: [null, "gSubtrahendY"],
            gFactorX: [null, 'gFactorXY'],
            gFactorY: [null, 'gFactorYY'],
            gComplexFactor: [null, 'gComplexFactorY'],
            gSimpleFactor: [null, 'gSimpleFactorY'],
            gDivident: [null, 'gDividentY'],
            gDivisor: [null, 'gDivisorY'],
            gComplexDivident: [null, 'gComplexDividentY'],
            gSimpleDivisor: [null, 'gSimpleDivisorY'],
            gTerm1: [null, null],
            gTerm2: [null, null],
            gTerm: [null, null],
            mValue: [null, null],
            mSimpleValue:[null, null],
            mSummand: [null, null],
            mMinuend: [null, null],
            mSubtrahend: [null, null],
            mFactor: [null, null],
            mDivident: [null, null],
            mDivisor: [null, null],
            mTerm1: [null, null],
            mTerm2: [null, null],
            mTerm: [null, null],
        }[this.typeInParent as TypeInParent] : [undefined, undefined]
        
        const parent = this?.parent as Expression;

        const dY = getTops ? getHeights(parent[getTops](this)).map((prev, val) => prev + val, 0) : 0;
        const dHeight = getOfParentY ? parent[getOfParentY] : 0;
        return dY + dHeight;
    }

    public get isNormX(): boolean {
        throw new Error("Method not implemented.");
    }
    public get isNormY(): boolean {
        throw new Error("Method not implemented.");
    }
}