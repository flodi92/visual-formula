import { MTypeInParent } from "../../types";
import MExpression from "../Expression";

export default class MSum extends MExpression {
    protected childrenTypesInParentDefinition(): MTypeInParent {
        return 'mSummand';
    }
    public get mSummands() {
        return this.children as MExpression[] | undefined;
    }
    public set mSummands(vals: MExpression[] | undefined) {
        super.setChildren(vals, 'mSummand');
    }
}