import GExpression from "./GExpression";
import GAbstractRoot from "./GAbstractRoot";
import { TypeInParent } from "../../types";
import { GTermI } from "./interfaces";

export default class GTerm extends GAbstractRoot implements GTermI {
    protected childrenTypesInParentDefinition(): TypeInParent[] {
        return ["gTerm"];
    }

    constructor(vals?: GTermI) {
        super();
        super.set(this, vals);
    }

    public set(vals?: GTermI) { super.set(this, vals); }

    public get gTerm() {
        return super.getChild('gTerm') as GExpression | undefined;
    }
    public set gTerm(child: GExpression | undefined) {
        super.setChild('gTerm', child);
    }
    public get unscaledWidth(): number {
        return this.gTerm?.unscaledWidth || 0;
    }
    public get unscaledHeight(): number {
        return this.gTerm?.unscaledHeight || 0;
    }
}