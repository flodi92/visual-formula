import GExpression from "./GExpression";
import { Direction, XY } from "../../types";
import { directionToXY } from "../../utils/general";

export default abstract class GAbstractDirectedExpression extends GExpression {
    _startDirection?: Direction;

    get startDirection(): Direction | undefined {
        return this._startDirection;
    }
    set startDirection(val: Direction | undefined) {
        this._startDirection = val;
    }
    get xy(): XY | undefined {
        return directionToXY(this.startDirection)
    }
}