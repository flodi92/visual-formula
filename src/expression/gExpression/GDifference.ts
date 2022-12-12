import GExpression from "./GExpression";
import GAbstractDirectedExpression from "./GAbstractDirectedExpression";
import { TypeInParent } from "../../types";
import { GDifferenceI } from "./interfaces";

export default class GDifference extends GAbstractDirectedExpression implements GDifferenceI {
    protected childrenTypesInParentDefinition(): TypeInParent[] {
        return ['gMinuend', 'gSubtrahend']
    }

    constructor(vals?: GDifferenceI) {
        super();
        super.set(this, vals);
    }

    public set(vals?: GDifferenceI) { super.set(this, vals); }

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


    protected getOfParentX(askingType: TypeInParent): number | undefined {
        return askingType === "gMinuend" ? this.gMinuendX
            : askingType === "gSubtrahend" ? this.gSubtrahendX
                : undefined;
    }
    protected getOfParentY(askingType: TypeInParent): number | undefined {
        return askingType === "gMinuend" ? this.gMinuendY
            : askingType === "gSubtrahend" ? this.gSubtrahendY
                : undefined;
    }
}