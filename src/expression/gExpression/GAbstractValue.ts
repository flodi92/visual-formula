import GExpression from "./GExpression";

export default abstract class GAbstractValue extends GExpression {
    private _numericValue: number | undefined;
    private _unscaledWidth?: number | undefined;
    private _unscaledHeight?: number | undefined;

    public get numericValue(): number | undefined {
        return this._numericValue;
    }
    public set numericValue(value: number | undefined) {
        this._numericValue = value;
    }

    set unscaledWidth(value: number | undefined) {
        this._unscaledWidth = value;
    }
    get unscaledWidth(): number | undefined {
        return this._unscaledWidth;
    }
    set unscaledHeight(value: number | undefined) {
        this._unscaledHeight = value;
    }
    get unscaledHeight(): number | undefined {
        return this._unscaledHeight;
    }
    
    public get isNormX(): boolean {
        return this._unscaledWidth === 1;
    }
    public get isNormY(): boolean {
        return this._unscaledHeight === 1;
    }
}