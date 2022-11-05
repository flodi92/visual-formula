import GAbstractValue from "./GAbstractValue";
import MExpression from "../mExpression/MExpression";
import { TypeInParent, XDirection, YDirection } from "../../types";

export default class GValue extends GAbstractValue {
    protected childrenTypesInParentDefinition(): TypeInParent[] {
        return ['mValue']
    }
    private _xEdge?: YDirection;
    private _yEdge?: XDirection;


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