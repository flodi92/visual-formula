import GAbstractValue from "./GAbstractValue";
import MExpression from "../mExpression/MExpression";
import { TypeInParent, XDirection, YDirection } from "../../types";

export default class GValue extends GAbstractValue {
    protected childrenTypesInParentDefinition(): TypeInParent[] {
        return ['mValue']
    }
    private _unscaledWidth: number;
    private _unscaledHeight: number;

    private _xEdge?: YDirection | undefined;
    private _yEdge?: XDirection | undefined;


    public get mValue() {
        return super.getChild('mValue') as MExpression | undefined;
    }
    public set mValue(child: MExpression | undefined) {
        super.setChild('mValue', child);
    }
    set unscaledWidth(value: number) {
        this._unscaledWidth = value;
    }
    get unscaledWidth(): number {
        return this._unscaledWidth;
    }
    set unscaledHeight(value: number) {
        this._unscaledHeight = value;
    }
    get unscaledHeight(): number {
        return this._unscaledHeight;
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