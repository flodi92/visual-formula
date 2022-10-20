import GExpression from "./GExpression";

export default abstract class GAbstractValue extends GExpression {
    private _numbericValue?: number;

    public get numericValue(): number {
        return this._numbericValue || 0;
    }
    public set numericValue(val: number) {
        this._numbericValue = val;
    }
}