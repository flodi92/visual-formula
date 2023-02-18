import Expression from "../Expression";
import getWidths from "../../utils/gExpression/getWidths";
import getHeights from "../../utils/gExpression/getHeights";
import { DEFAULT_TRANSFORMATION, Transformation, TypeInParent } from "../../types";

export default abstract class GExpression extends Expression {
    public get x(): number {
        return this.unscaledX * this.transformation.scaleX + this.transformation.x;
    }
    public get y(): number {
        return this.unscaledY * this.transformation.scaleY + this.transformation.y;
    }
    public get width(): number {
        return (this.unscaledWidth || 0) * this.transformation.scaleX;
    }
    public get height(): number {
        return (this.unscaledHeight || 0) * this.transformation.scaleY;
    }

    public get transformation(): Transformation {
        const { x: x1, y: y1, scaleX: scaleX1, scaleY: scaleY1 } = this.layerTransformation;
        const { x: x2, y: y2, scaleX: scaleX2, scaleY: scaleY2 } = (this.parent as GExpression)?.transformation || DEFAULT_TRANSFORMATION;
        return { x: x1 + scaleX1 * x2, y: y1 + scaleY1 * y2, scaleX: scaleX1 * scaleX2, scaleY: scaleY1 * scaleY2 }
    }
    public get layerTransformation(): Transformation {
        return this.getLayerTransformationOfTerm(this.typeInParent);
    }

    abstract get unscaledWidth(): number | undefined;
    abstract get unscaledHeight(): number | undefined;

    public get unscaledX(): number {
        if (!this.parent || !this.typeInParent) return 0;
        const lefts = (this.parent as GExpression).getLefts(this);
        const dx = !!lefts ? getWidths(lefts).reduce((prev, val) => prev + val, 0) : 0;
        const x = (this.parent as GExpression).getOfParentX(this.typeInParent) || 0;
        return x + dx;

    }
    public get unscaledY(): number {
        if (!this.parent || !this.typeInParent) return 0;
        const tops = (this.parent as GExpression).getTops(this);
        const dy = !!tops ? getHeights(tops).reduce((prev, val) => prev + val, 0) : 0;
        const y = (this.parent as GExpression).getOfParentY(this.typeInParent) || 0;
        return y + dy;
    }

    public get isNormX(): boolean {
        return this.unscaledX === 1;
    }
    public get isNormY(): boolean {
        return this.unscaledY === 1;
    }

    protected getLefts(askingExpression: GExpression): GExpression[] | undefined {
        return undefined;
    }
    protected getTops(askingExpression: GExpression): GExpression[] | undefined {
        return undefined;
    }
    protected getOfParentX(askingType: TypeInParent): number | undefined {
        return undefined;
    }
    protected getOfParentY(askingType: TypeInParent): number | undefined {
        return undefined;
    }
    protected getLayerTransformationOfTerm(askingType?: TypeInParent): Transformation {
        return DEFAULT_TRANSFORMATION;
    }

    public abstract get numericValue(): number | undefined;
}