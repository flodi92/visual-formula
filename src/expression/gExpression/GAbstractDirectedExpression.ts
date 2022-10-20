import GExpression from "./GExpression";
import { Direction, XY } from "../../types";
import { directionToXY } from "../../utils/general";

export default abstract class GAbstractDirectedExpression extends GExpression {
    _startDirection: Direction;

    get startDirection(): Direction {
        return this._startDirection;
    }
    set startDirection(val: Direction) {
        this._startDirection = val;
    }
    get xy(): XY {
        return directionToXY(this.startDirection)
    }
}