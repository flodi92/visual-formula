import GExpression from "./GExpression";
import { TypeInParent, XDirection, YDirection } from "../../types";
import { GProduct2DI } from "./interfaces";

export default class GProduct2D extends GExpression implements GProduct2DI {
    protected childrenTypesInParentDefinition(): TypeInParent[] {
        return ['gFactorX', 'gFactorY']
    }

    private _xEdge?: YDirection | undefined;
    private _yEdge?: XDirection | undefined;

    constructor(vals?: GProduct2DI) {
        super();
        super.set(this, vals);
    }
    
    public set(vals?: GProduct2DI) { super.set(this, vals); }

    public get gFactorX() {
        return super.getChild('gFactorX') as GExpression | undefined;
    }
    public set gFactorX(child: GExpression | undefined) {
        super.setChild('gFactorX', child);
    }
    public get gFactorY() {
        return super.getChild('gFactorY') as GExpression | undefined;
    }
    public set gFactorY(child: GExpression | undefined) {
        super.setChild('gFactorY', child);
    }

    public get xEdge(): YDirection | undefined {
        return this._xEdge;
    }
    public set xEdge(value: YDirection | undefined) {
        this._xEdge = value;
    }
    public get yEdge(): XDirection | undefined {
        return this._yEdge;
    }
    public set yEdge(value: XDirection | undefined) {
        this._yEdge = value;
    }

    public get unscaledWidth(): number {
        return this.gFactorX?.unscaledWidth || 0
    }
    public get unscaledHeight(): number {
        return this.gFactorY?.unscaledHeight || 0
    }

    public get gFactorXX(): number {
        return this.unscaledX;
    }
    public get gFactorXY(): number {
        return this.xEdge === 'top' ?
            this.unscaledX - 1
            : this.unscaledX + this.unscaledHeight;
    }
    public get gFactorYX(): number {
        return this.yEdge === 'left' ?
            this.unscaledY - 1
            : this.unscaledY + this.unscaledWidth;
    }
    public get gFactorYY(): number {
        return this.unscaledY;
    }

    protected getOfParentX(askingType: TypeInParent): number | undefined {
        return askingType === "gFactorX" ? this.gFactorXX
            : askingType === "gFactorY" ? this.gFactorYX
                : undefined;
    }
    protected getOfParentY(askingType: TypeInParent): number | undefined {
        return askingType === "gFactorX" ? this.gFactorXY
            : askingType === "gFactorY" ? this.gFactorYY
                : undefined;
    }
}