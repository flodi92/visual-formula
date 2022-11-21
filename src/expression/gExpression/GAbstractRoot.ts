import GExpression from "./GExpression";
import { DEFAULT_TRANSFORMATION, Transformation } from "../../types";
import { cloneExpression, getFormulaStringFromExpression, getJSONFromExpression, getMExpressionFromExpression } from "../../conversion";

export default abstract class GAbstractRoot extends GExpression {
    private _layerTransformation: Transformation = DEFAULT_TRANSFORMATION;

    public get layerTransformation(): Transformation {
        return this._layerTransformation;
    }
    public set layerTransformation(val: Transformation) {
        this._layerTransformation = val;
    }

    // delegates ////////////

    public get mExpression() {
        return getMExpressionFromExpression(this);
    }

    public get json() {
        return getJSONFromExpression(this);
    }

    public get formulaString() {
        return getFormulaStringFromExpression(this);
    }

    public clone() {
        return cloneExpression(this) as GAbstractRoot;
    }
}