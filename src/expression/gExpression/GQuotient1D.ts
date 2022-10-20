import GExpression from "./GExpression";
import GAbstractDirectedExpression from "./GAbstractDirectedExpression";
import GSimpleValue from "./GSimpleValue";
import { TypeInParent } from "../../types";
import { directionToXY } from "../../utils/general";

export default class GQuotient extends GAbstractDirectedExpression {
    protected childrenTypesInParentDefinition(): TypeInParent[] {
        return ['gSimpleDivisor', 'gComplexDivident']
    }
    public get gSimpleDivisor() {
        return super.getChild('gSimpleDivisor') as GSimpleValue | undefined;
    }
    public set gSimpleDivisor(child: GSimpleValue | undefined) {
        super.setChild('gSimpleDivisor', child);
    }
    public get gComplexDivident() {
        return super.getChild('gComplexDivident') as GExpression | undefined;
    }
    public set gComplexDivident(child: GExpression | undefined) {
        super.setChild('gComplexDivident', child);
    }

    public get unscaledWidth(): number {
        return directionToXY(this.startDirection) === 'X' ?
            (this.gComplexDivident?.unscaledWidth || 0) -
            (this.gSimpleDivisor?.unscaledWidth || 0)
            : (this.gComplexDivident?.unscaledWidth || 0);
    }
    public get unscaledHeight(): number {
        return directionToXY(this.startDirection) === 'Y' ?
            (this.gComplexDivident?.unscaledHeight || 0) -
            (this.gSimpleDivisor?.unscaledHeight || 0)
            : (this.gComplexDivident?.unscaledHeight || 0);
    }

    public get gComplexDividentX(): number {
        const dx =
            this.startDirection === "left"
                ? -(this.gSimpleDivisor?.unscaledWidth || 0)
                : 0;
        return this.unscaledWidth + dx;
    }
    public get gComplexDividentY(): number {
        const dy =
            this.startDirection === "top"
                ? -(this.gSimpleDivisor?.unscaledHeight || 0)
                : 0;
        return this.unscaledWidth + dy;
    }
    public get gSimpleDivisorX(): number {
        const dx =
            {
                left: -(this.gSimpleDivisor?.unscaledWidth || 0),
                right: this.unscaledWidth || 0,
            }[this.startDirection] || 0;
        return this.unscaledWidth + dx;
    }
    public get gSimpleDivisorY(): number {
        const dy =
            {
                top: -(this.gSimpleDivisor?.unscaledHeight || 0),
                bottom: this.unscaledHeight || 0,
            }[this.startDirection] || 0;
        return this.unscaledHeight + dy;
    }
}