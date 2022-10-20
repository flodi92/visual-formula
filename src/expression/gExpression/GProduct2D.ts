import GExpression from "./GExpression";
import GAbstractDirectedExpression from "./GAbstractDirectedExpression";
import { TypeInParent, XDirection, YDirection } from "../../types";

export default class GProduct2D extends GAbstractDirectedExpression {
    protected childrenTypesInParentDefinition(): TypeInParent[] {
        return ['gFactorX', 'gFactorY']
    }

    private _xEdge?: YDirection | undefined;
    private _yEdge?: XDirection | undefined;
    
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
}