import { MTypeInParent } from "../../types";
import MExpression from "./MExpression";

export default class MValue extends MExpression {
    protected childrenTypesInParentDefinition(): MTypeInParent[] {
        return [];
    }

    private _mValue: string;
    public get mValue(): string {
        return this._mValue;
    }
    public set mValue(value: string) {
        this._mValue = value;
    }
}