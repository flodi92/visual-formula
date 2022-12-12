import { MTypeInParent } from "../../types";
import { MQuotientI } from "./interfaces";
import MExpression from "./MExpression";

export default class MQuotient extends MExpression implements MQuotientI {
    protected childrenTypesInParentDefinition(): MTypeInParent[] {
        return ['mDivident', 'mDivisor'];
    }
    constructor(vals?: MQuotientI) {
        super();
        super.set(this, vals);
    }
    public set(vals?: MQuotientI) { super.set(this, vals); }
    public get mDivident() {
        return super.getChild('mDivident') as MExpression | undefined;
    }
    public set mDivident(child: MExpression | undefined) {
        super.setChild('mDivident', child);
    }
    public get mDivisor() {
        return super.getChild('mDivisor') as MExpression | undefined;
    }
    public set mDivisor(child: MExpression | undefined) {
        super.setChild('mDivisor', child);
    }
}