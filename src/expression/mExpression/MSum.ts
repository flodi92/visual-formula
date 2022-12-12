import { MTypeInParent } from "../../types";
import { MSumI } from "./interfaces";
import MExpression from "./MExpression";

export default class MSum extends MExpression implements MSumI {
    protected childrenTypesInParentDefinition(): MTypeInParent {
        return 'mSummand';
    }
    constructor(vals?: MSumI) {
        super();
        super.set(this, vals);
    }
    public set(vals?: MSumI) { super.set(this, vals); }
    public get mSummands() {
        return this.children as MExpression[] | undefined;
    }
    public set mSummands(vals: MExpression[] | undefined) {
        super.setChildren(vals, 'mSummand');
    }
}