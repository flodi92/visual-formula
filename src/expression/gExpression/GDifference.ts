import GExpression from "./GExpression";
import GAbstractDirectedExpression from "./GAbstractDirectedExpression";
import { TypeInParent } from "../../types";

export default class GDifference extends GAbstractDirectedExpression {
    protected childrenTypesInParentDefinition(): TypeInParent[] {
        return ['gMinuend', 'gSubtrahend']
    }
    public get gMinuend() {
        return super.getChild('gMinuend') as GExpression | undefined;
    }
    public set gMinuend(child: GExpression | undefined) {
        super.setChild('gMinuend', child);
    }
    public get gSubtrahend() {
        return super.getChild('gSubtrahend') as GExpression | undefined;
    }
    public set gSubtrahend(child: GExpression | undefined) {
        super.setChild('gSubtrahend', child);
    }
    public get unscaledWidth(): number {
        const minuendWidth = this?.gMinuend?.unscaledWidth || 0;
        const subtrahendWidth = this?.gSubtrahend?.unscaledWidth || 0;
        if (this.xy === 'X') {
            return (minuendWidth - subtrahendWidth);
        } else {
            return Math.max(minuendWidth, subtrahendWidth)
        }
    }
    public get unscaledHeight(): number {
        const minuendHeight = this?.gMinuend?.unscaledHeight || 0;
        const subtrahendHeight = this?.gSubtrahend?.unscaledHeight || 0;
        if (this.xy === 'Y') {
            return (minuendHeight - subtrahendHeight);
        } else {
            return Math.max(minuendHeight, subtrahendHeight)
        }
    }
    public get gMinuendX() {
        const dx =
            this.startDirection === "right"
                ? - (this?.gSubtrahend?.unscaledWidth || 0)
                : 0;

        return this.unscaledX + dx;
    }
    public get gMinuendY() {
        const dy =
            this.startDirection === "bottom"
                ? - (this?.gSubtrahend?.unscaledHeight || 0)
                : 0;

        return this.unscaledY + dy;
    }
    public get gSubtrahendX() {
        const dx =
            this.startDirection === "left"
                ? this.unscaledWidth
                : this.startDirection === "right"
                    ? -(this.gSubtrahend?.unscaledWidth || 0)
                    : 0;
        return this.unscaledX + dx;
    }
    public get gSubtrahendY() {
        const dy =
            this.startDirection === "top"
                ? this.unscaledHeight
                : this.startDirection === "bottom"
                    ? -(this.gSubtrahend?.unscaledHeight || 0)
                    : 0;
        return this.unscaledY + dy;
    }
}