import GAbstractValue from "./GAbstractValue";
import MExpression from "../mExpression/MExpression";
import { Direction, TypeInParent } from "../../types";
import { GSimpleValueI } from "./interfaces";

export default class GSimpleValue extends GAbstractValue implements GSimpleValueI {
    protected childrenTypesInParentDefinition(): TypeInParent[] {
        return ['mSimpleValue']
    }

    private _edge?: Direction | undefined;
    
    constructor(vals?: GSimpleValueI) {
        super();
        super.set(this, vals);
    }

    public get edge(): Direction | undefined {
        return this._edge;
    }
    public set edge(value: Direction | undefined) {
        this._edge = value;
    }

    public get mSimpleValue() {
        return super.getChild('mSimpleValue') as MExpression | undefined;
    }
    public set mSimpleValue(child: MExpression | undefined) {
        super.setChild('mSimpleValue', child);
    }
}