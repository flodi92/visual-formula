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

    public get unscaledX(): number {
        if (!this.parent) return 0;
        const lefts = (this.parent as GExpression).getLefts(this);
        const dx = lefts && getWidths(lefts).reduce((prev, val) => prev + val, 0);
        const x = this.typeInParent && (this.parent as GExpression).getOfParentX(this.typeInParent);
        return x && dx ? x + dx : 0;

    }
    public get unscaledY(): number {
        if (!this.parent) return 0;
        const tops = (this.parent as GExpression).getTops(this);
        const dy = tops && getHeights(tops).reduce((prev, val) => prev + val, 0);
        const y = this.typeInParent && (this.parent as GExpression).getOfParentY(this.typeInParent);
        return y && dy ? y + dy : 0;
    }

    public get isNormX(): boolean {
        return this.unscaledX === 1;
    }
    public get isNormY(): boolean {
        return this.unscaledY === 1;
    }
}