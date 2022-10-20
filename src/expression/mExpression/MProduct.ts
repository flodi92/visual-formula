import { MTypeInParent } from "../../types";
import MExpression from "./MExpression";

export default class MProduct extends MExpression {
    protected childrenTypesInParentDefinition(): MTypeInParent {
        return 'mFactor';
    }
    public get mFactors() {
        return this.children as MExpression[] | undefined;
    }
    public set mFactors(vals: MExpression[] | undefined) {
        super.setChildren(vals, 'mFactor');
    }
}