import GAbstractValue from "./GAbstractValue";
import MExpression from "../mExpression/MExpression";
import { Direction, TypeInParent } from "../../types";

export default class GSimpleValue extends GAbstractValue {
    protected childrenTypesInParentDefinition(): TypeInParent[] {
        return ['mSimpleValue']
    }
    private _unscaledWidth?: number | undefined;
    private _unscaledHeight?: number | undefined;

    private _edge?: Direction | undefined;

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
}