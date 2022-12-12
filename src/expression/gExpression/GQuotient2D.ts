import GExpression from "./GExpression";
import { Direction, TypeInParent } from "../../types";
import { directionToXY } from "../../utils/general";
import { GQuotient2DI } from "./interfaces";

export default class GQuotient2D extends GExpression implements GQuotient2DI {
    protected childrenTypesInParentDefinition(): TypeInParent[] {
        return ['gDivident', 'gDivisor']
    }

    private _divisorEdge?: Direction | undefined;
    private _resultEdge?: Direction | undefined;

    constructor(vals?: GQuotient2DI) {
        super();
        super.set(this, vals);
    }
    
    public set(vals?: GQuotient2DI) { super.set(this, vals); }

    public get gDivident() {
        return super.getChild('gDivident') as GExpression | undefined;
    }
    public set gDivident(child: GExpression | undefined) {
        super.setChild('gDivident', child);
    }
    public get gDivisor() {
        return super.getChild('gDivisor') as GExpression | undefined;
    }
    public set gDivisor(child: GExpression | undefined) {
        super.setChild('gDivisor', child);
    }

    public get divisorEdge(): Direction | undefined {
        return this._divisorEdge;
    }
    public set divisorEdge(value: Direction | undefined) {
        this._divisorEdge = value;
    }
    public get resultEdge(): Direction | undefined {
        return this._resultEdge;
    }
    public set resultEdge(value: Direction | undefined) {
        this._resultEdge = value;
    }

    public get unscaledWidth(): number {
        return directionToXY(this.resultEdge) === 'Y' ?
            this.gDivident?.unscaledWidth || 0 : 1;
    }
    public get unscaledHeight(): number {
        return directionToXY(this.resultEdge) === 'X' ?
            this.gDivident?.unscaledHeight || 0 : 1;
    }

    public get gDividentX(): number {
        if (directionToXY(this.resultEdge) === 'Y') {
            return this.unscaledX;
        } else {
            return this.unscaledX +
                (this.resultEdge === "left" ?
                    1 :
                    -(this.gDivident?.unscaledWidth || 0))
        }
    }
    public get gDividentY(): number {
        if (directionToXY(this.resultEdge) === 'X') {
            return this.unscaledY;
        } else {
            return this.unscaledY +
                (this.resultEdge === "top" ?
                    1 :
                    -(this.gDivident?.unscaledHeight || 0))
        }
    }
    public get gDivisorX(): number {
        const dx =
            this.divisorEdge === "left"
                ? -1
                : this.divisorEdge === "right"
                    ? this.unscaledWidth
                    : this.resultEdge === "left"
                        ? 1
                        : this.resultEdge === "right"
                            ? -(this.gDivident?.unscaledWidth || 0)
                            : 0;
        return this.unscaledX + dx;
    }
    public get gDivisorY(): number {
        const dy =
            this.divisorEdge === "top"
                ? -1
                : this.divisorEdge === "bottom"
                    ? this.unscaledHeight
                    : this.resultEdge === "top"
                        ? 1
                        : this.resultEdge === "bottom"
                            ? -(this.gDivident?.unscaledHeight || 0)
                            : 0;
        return this.unscaledX + dy;
    }

    protected getOfParentX(askingType: TypeInParent): number | undefined {
        return askingType === "gDivident" ? this.gDividentX
            : askingType === "gDivisor" ? this.gDivisorX
                : undefined;
    }
    protected getOfParentY(askingType: TypeInParent): number | undefined {
        return askingType === "gDivident" ? this.gDividentY
            : askingType === "gDivisor" ? this.gDivisorY
                : undefined;
    }
}