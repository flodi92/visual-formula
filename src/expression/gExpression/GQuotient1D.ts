import GExpression from "./GExpression";
import GAbstractDirectedExpression from "./GAbstractDirectedExpression";
import GSimpleValue from "./GSimpleValue";
import { TypeInParent } from "../../types";
import { directionToXY } from "../../utils/general";
import { GQuotient1DI } from "./interfaces";

export default class GQuotient1D extends GAbstractDirectedExpression implements GQuotient1DI {
    protected childrenTypesInParentDefinition(): TypeInParent[] {
        return ['gSimpleDivisor', 'gComplexDivident']
    }

    constructor(vals?: GQuotient1DI) {
        super();
        super.set(this, vals);
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
        return this.unscaledX + dx;
    }
    public get gComplexDividentY(): number {
        const dy =
            this.startDirection === "top"
                ? -(this.gSimpleDivisor?.unscaledHeight || 0)
                : 0;
        return this.unscaledY + dy;
    }
    public get gSimpleDivisorX(): number {
        const dx =
            this.startDirection ?
                {
                    left: -(this.gSimpleDivisor?.unscaledWidth || 0),
                    right: this.unscaledWidth || 0,
                    top: 0,
                    bottom: 0,
                }[this.startDirection] : 0;
        return this.unscaledX + dx;
    }
    public get gSimpleDivisorY(): number {
        const dy =
            this.startDirection ?
                {
                    top: -(this.gSimpleDivisor?.unscaledHeight || 0),
                    bottom: this.unscaledHeight || 0,
                    left: 0,
                    right: 0
                }[this.startDirection] : 0;
        return this.unscaledY + dy;
    }

    protected getOfParentX(askingType: TypeInParent): number | undefined {
        return askingType === "gComplexDivident" ? this.gComplexDividentX
            : askingType === "gSimpleDivisor" ? this.gSimpleDivisorX
                : undefined;
    }
    protected getOfParentY(askingType: TypeInParent): number | undefined {
        return askingType === "gComplexDivident" ? this.gComplexDividentY
            : askingType === "gSimpleDivisor" ? this.gSimpleDivisorY
                : undefined;
    }
}