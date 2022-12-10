import GAbstractValue from "./GAbstractValue";
import MExpression from "../mExpression/MExpression";
import { TypeInParent, XDirection, YDirection } from "../../types";
import { GValueI } from "./interfaces";

export default class GValue extends GAbstractValue implements GValueI {
    protected childrenTypesInParentDefinition(): TypeInParent[] {
        return ['mValue']
    }
    private _xEdge?: YDirection;
    private _yEdge?: XDirection;

    constructor(vals?: GValueI) {
        super();
        super.init(vals, this);
    }

    public get mValue() {
        return super.getChild('mValue') as MExpression | undefined;
    }
    public set mValue(child: MExpression | undefined) {
        super.setChild('mValue', child);
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