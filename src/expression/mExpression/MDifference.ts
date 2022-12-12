import { MTypeInParent } from "../../types";
import { MDifferenceI } from "./interfaces";
import MExpression from "./MExpression";

export default class MDifference extends MExpression implements MDifferenceI {
    protected childrenTypesInParentDefinition(): MTypeInParent[] {
        return ['mMinuend', 'mSubtrahend'];
    }
    constructor(vals?: MDifference) {
        super();
        super.set(this, vals);
    }
    public get mMinuend() {
        return super.getChild('mMinuend') as MExpression | undefined;
    }
    public set mMinuend(child: MExpression | undefined) {
        super.setChild('mMinuend', child);
    }
    public get mSubtrahend() {
        return super.getChild('mSubtrahend') as MExpression | undefined;
    }
    public set mSubtrahend(child: MExpression | undefined) {
        super.setChild('mSubtrahend', child);
    }
}