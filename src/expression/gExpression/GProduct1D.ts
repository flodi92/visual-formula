import GExpression from "./GExpression";
import GSimpleValue from "./GSimpleValue";
import GAbstractDirectedExpression from "./GAbstractDirectedExpression";
import { TypeInParent } from "../../types";
import { directionToXY } from "../../utils/general";
import { GProduct1DI } from "./interfaces";

export default class GProduct1D extends GAbstractDirectedExpression implements GProduct1DI {
    protected childrenTypesInParentDefinition(): TypeInParent[] {
        return ['gSimpleFactor', 'gComplexFactor']
    }

    constructor(vals?: GProduct1DI) {
        super();
        super.set<GProduct1DI>(this, vals);
    }

    public set(vals?: GProduct1DI) { super.set<GProduct1DI>(this, vals); }

    public get gSimpleFactor() {
        return super.getChild('gSimpleFactor') as GSimpleValue | undefined;
    }
    public set gSimpleFactor(child: GSimpleValue | undefined) {
        super.setChild('gSimpleFactor', child);
    }
    public get gComplexFactor() {
        return super.getChild('gComplexFactor') as GExpression | undefined;
    }
    public set gComplexFactor(child: GExpression | undefined) {
        super.setChild('gComplexFactor', child);
    }
    public get unscaledWidth(): number {
        return directionToXY(this.startDirection) === 'X' ?
            (this.gComplexFactor?.unscaledWidth || 0) + (this.gSimpleFactor?.unscaledWidth || 0)
            : (this.gComplexFactor?.unscaledWidth || 0)
    }
    public get unscaledHeight(): number {
        return directionToXY(this.startDirection) === 'Y' ?
            (this.gComplexFactor?.unscaledHeight || 0) + (this.gSimpleFactor?.unscaledHeight || 0)
            : (this.gComplexFactor?.unscaledHeight || 0)
    }

    public get gComplexFactorX(): number {
        const dx =
            this.startDirection === "right"
                ? (this.gSimpleFactor?.unscaledWidth || 0)
                : 0;
        return this.unscaledX + dx;
    }
    public get gComplexFactorY(): number {
        const dy =
            this.startDirection === "bottom"
                ? (this.gSimpleFactor?.unscaledHeight || 0)
                : 0;
        return this.unscaledY + dy;
    }
    public get gSimpleFactorX(): number {
        const dx =
            this.startDirection === "left"
                ? (this.gComplexFactor?.unscaledWidth || 0)
                : 0;
        return this.unscaledX + dx;
    }
    public get gSimpleFactorY(): number {
        const dy =
            this.startDirection === "top"
                ? (this.gComplexFactor?.unscaledHeight || 0)
                : 0;
        return this.unscaledY + dy;
    }

    protected getOfParentX(askingType: TypeInParent): number | undefined {
        return askingType === "gComplexFactor" ? this.gComplexFactorX
            : askingType === "gSimpleFactor" ? this.gSimpleFactorX
                : undefined;
    }
    protected getOfParentY(askingType: TypeInParent): number | undefined {
        return askingType === "gComplexFactor" ? this.gComplexFactorY
            : askingType === "gSimpleFactor" ? this.gSimpleFactorY
                : undefined;
    }

    public get numericValue() {
        return this.gComplexFactor?.numericValue !== undefined
            && this.gSimpleFactor?.numericValue !== undefined
            ? this.gComplexFactor.numericValue * this.gSimpleFactor.numericValue
            : undefined;
    }
}