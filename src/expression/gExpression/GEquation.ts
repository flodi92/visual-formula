import GExpression from "./GExpression";
import GAbstractRoot from "./GAbstractRoot";
import { DEFAULT_TRANSFORMATION, Transformation, TypeInParent } from "../../types";

export default class GEquation extends GAbstractRoot {
    protected childrenTypesInParentDefinition(): TypeInParent[] {
        return ["gTerm1", "gTerm2"];
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
    public get unscaledWidth(): number {
        throw 'TODO'
    }
    public get unscaledHeight(): number {
        throw 'TODO'
    }

    protected getLayerTransformationOfTerm(askingType?: TypeInParent): Transformation {
        if (!this.gTerm1 || !this.gTerm2) return DEFAULT_TRANSFORMATION;

        const [gTerm1, gTerm2] = [this.gTerm1, this.gTerm2];
        const [x, y] = [gTerm1?.unscaledX, gTerm1?.unscaledY];

        let scaleX: number, scaleY: number;
        if (askingType === 'gTerm1') {
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