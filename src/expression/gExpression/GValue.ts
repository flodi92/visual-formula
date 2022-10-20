import GAbstractValue from "./GAbstractValue";
import MExpression from "../mExpression/MExpression";
import { TypeInParent, XDirection, YDirection } from "../../types";

export default class GValue extends GAbstractValue {
    protected childrenTypesInParentDefinition(): TypeInParent[] {
        return ['mValue']
    }
    private _unscaledWidth?: number | undefined;
    private _unscaledHeight?: number | undefined;

    private _xEdge?: YDirection;
    private _yEdge?: XDirection;


    public get mValue() {
        return super.getChild('mValue') as MExpression | undefined;
    }
    public set mValue(child: MExpression | undefined) {
        super.setChild('mValue', child);
    }
    set unscaledWidth(value: number | undefined) {
        this._unscaledWidth = value;
    }
    get unscaledWidth(): number {
        return this._unscaledWidth || 0;
    }
    set unscaledHeight(value: number | undefined) {
        this._unscaledHeight = value;
    }
    get unscaledHeight(): number {
        return this._unscaledHeight || 0;
    }

    public get isNormX(): boolean {
        return this._unscaledWidth === 1;
    }
    public get isNormY(): boolean {
        return this._unscaledHeight === 1;
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
}