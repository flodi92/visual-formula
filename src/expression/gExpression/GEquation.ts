import GExpression from "./GExpression";
import GAbstractRoot from "./GAbstractRoot";
import { TypeInParent } from "../../types";

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
}