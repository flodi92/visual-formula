import GExpression from "./GExpression";

export default abstract class GAbstractValue extends GExpression {
    private _numericValue: number | undefined;
    public get numericValue(): number | undefined {
        return this._numericValue;
    }
    public set numericValue(value: number | undefined) {
        this._numericValue = value;
    }
}