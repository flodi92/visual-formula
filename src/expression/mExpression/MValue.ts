import { MTypeInParent } from "../../types";
import MExpression from "./MExpression";

export default class MValue extends MExpression {
    protected childrenTypesInParentDefinition(): MTypeInParent[] {
        return [];
    }

    private _mValue?: string | undefined;
    public get mValue(): string | undefined {
        return this._mValue;
    }
    public set mValue(value: string | undefined) {
        this._mValue = value;
    }
    public get isConstant(): boolean {
        return !parseInt(`${this._mValue}`) || !parseFloat(`${this._mValue}`);
    }
}