import GExpression from "./GExpression";
import GAbstractDirectedExpression from "./GAbstractDirectedExpression";
import { TypeInParent } from "../../types";
import { takeWhile, takeRightWhile } from 'lodash';
import { directionToXY, } from "../../utils/general";
import { getHeights, getWidths } from "../../utils/gExpression";
import { GSumI } from "./interfaces";

export default class GSum extends GAbstractDirectedExpression implements GSumI {
    protected childrenTypesInParentDefinition(): TypeInParent {
        return "gSummand"
    }

    constructor(vals?: GSumI) {
        super();
        super.init(vals, this);
    }
    
    public get gSummands() {
        return this.children as GExpression[] | undefined;
    }
    public set gSummands(vals: GExpression[] | undefined) {
        super.setChildren(vals, 'gSummand');
    }
    public get unscaledWidth(): number {
        if (directionToXY(this.startDirection) === 'X') {
            return (getWidths(this.gSummands || [])).reduce((sum, width) => sum + width, 0)
        } else {
            return Math.max(...getWidths(this.gSummands || []))
        }
    }
    public get unscaledHeight(): number {
        if (directionToXY(this.startDirection) === 'Y') {
            return (getHeights(this.gSummands || [])).reduce((sum, height) => sum + height, 0)
        } else {
            return Math.max(...getHeights(this.gSummands || []))
        }
    }

    public getLeftSummands(askingExpression: GExpression): GExpression[] {
        return this.startDirection === 'left' ?
            takeWhile(this.gSummands, (exp: GExpression) => exp?.id !== askingExpression?.id) :
            this.startDirection === 'right' ?
                takeRightWhile(this.gSummands, (exp: GExpression) => exp?.id !== askingExpression?.id) :
                [];
    }
    public getTopSummands(askingExpression: GExpression): GExpression[] {
        return this.startDirection === 'top' ?
            takeWhile(this.gSummands, (exp: GExpression) => exp?.id !== askingExpression?.id) :
            this.startDirection === 'bottom' ?
                takeRightWhile(this.gSummands, (exp: GExpression) => exp?.id !== askingExpression?.id) :
                [];
    }

    protected getLefts(askingExpression: GExpression): GExpression[] | undefined {
        return this.getLeftSummands(askingExpression);
    }
    protected getTops(askingExpression: GExpression): GExpression[] | undefined {
        return this.getTopSummands(askingExpression);
    }
    protected getOfParentX(): number | undefined {
        return this.unscaledX;
    }
    protected getOfParentY(): number | undefined {
        return this.unscaledY;
    }
}