import GExpression from "./GExpression";
import { DEFAULT_TRANSFORMATION, Transformation } from "../../types";

export default abstract class GAbstractRoot extends GExpression {
    private _layerTransformation: Transformation = DEFAULT_TRANSFORMATION;

    public get layerTransformation(): Transformation {
        return this._layerTransformation;
    }
    public set layerTransformation(val: Transformation) {
        this._layerTransformation = val;
    }
}