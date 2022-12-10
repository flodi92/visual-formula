import GExpression from "./GExpression";
import GAbstractRoot from "./GAbstractRoot";
import { DEFAULT_TRANSFORMATION, Transformation, TypeInParent } from "../../types";
import { GEquationI } from "./interfaces";

export default class GEquation extends GAbstractRoot implements GEquationI {
    protected childrenTypesInParentDefinition(): TypeInParent[] {
        return ["gTerm1", "gTerm2"];
    }

    constructor(vals?: GEquationI) {
        super();
        super.init(vals, this);
    }
    
    public get gTerm1() {
        return super.getChild('gTerm1') as GExpression | undefined;
    }
    public set gTerm1(child: GExpression | undefined) {
        super.setChild('gTerm1', child);
    }
    public get gTerm2() {
        return super.getChild('gTerm2') as GExpression | undefined;
    }
    public set gTerm2(child: GExpression | undefined) {
        super.setChild('gTerm2', child);
    }
    public get unscaledWidth(): number | undefined {
        return this.gTerm1?.unscaledWidth;
    }
    public get unscaledHeight(): number | undefined {
        return this.gTerm1?.unscaledHeight;
    }

    protected getLayerTransformationOfTerm(askingType?: TypeInParent): Transformation {
        if (!this.gTerm1 || !this.gTerm2) return DEFAULT_TRANSFORMATION;

        const [gTerm1, gTerm2] = [this.gTerm1, this.gTerm2];
        const [x, y] = [gTerm1?.unscaledX, gTerm1?.unscaledY];

        let scaleX: number, scaleY: number;
        if (!gTerm1.unscaledWidth || !gTerm1.unscaledHeight || !gTerm2.unscaledWidth || !gTerm2.unscaledHeight) {
            return DEFAULT_TRANSFORMATION;
        }
        else if (askingType === 'gTerm1') {
            scaleX = (gTerm1.unscaledWidth < gTerm2.unscaledWidth) ? 1 : gTerm2.unscaledWidth / gTerm1.unscaledWidth
            scaleY = (gTerm1.unscaledHeight < gTerm2.unscaledHeight) ? 1 : gTerm2.unscaledHeight / gTerm1.unscaledHeight
        } else if (askingType === 'gTerm2') {
            scaleX = (gTerm2.unscaledWidth < gTerm1.unscaledWidth) ? 1 : gTerm1.unscaledWidth / gTerm2.unscaledWidth
            scaleY = (gTerm2.unscaledHeight < gTerm1.unscaledHeight) ? 1 : gTerm1.unscaledHeight / gTerm2.unscaledHeight
        } else {
            return DEFAULT_TRANSFORMATION;
        }

        return { x, y, scaleX, scaleY }
    }
}