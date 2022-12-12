import { MTypeInParent } from "../../types";
import { MValueI } from "./interfaces";
import MExpression from "./MExpression";

export default class MValue extends MExpression implements MValueI   {
    protected childrenTypesInParentDefinition(): MTypeInParent[] {
        return [];
    }
    constructor(vals?: MValueI) {
        super();
        super.set(this, vals);
    }
    private _mValue?: string | undefined;
    public get mValue(): string | undefined {
        return this._mValue;
    }
    public set mValue(value: string | undefined) {
        this._mValue = value;
    }
    public get isConstant(): boolean {
        return !parseInt(`${this._mValue}`) && !parseFloat(`${this._mValue}`);
    }
}