import { MTypeInParent } from "../../types";
import { MProductI } from "./interfaces";
import MExpression from "./MExpression";

export default class MProduct extends MExpression implements MProductI {
    protected childrenTypesInParentDefinition(): MTypeInParent {
        return 'mFactor';
    }
    constructor(vals?: MProductI) {
        super();
        super.set(this, vals);
    }
    public get mFactors() {
        return this.children as MExpression[] | undefined;
    }
    public set mFactors(vals: MExpression[] | undefined) {
        super.setChildren(vals, 'mFactor');
    }
}