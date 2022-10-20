import GExpression from "./GExpression";

export default abstract class GAbstractValue extends GExpression {
    private _numbericValue: number;

    public get numericValue(): number {
        return this._numbericValue;
    }
    public set numericValue(val: number) {
        this._numbericValue = val;
    }
}