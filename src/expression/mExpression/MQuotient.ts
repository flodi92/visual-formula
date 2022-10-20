import { MTypeInParent } from "../../types";
import MExpression from "./MExpression";

export default class MQuotient extends MExpression {
    protected childrenTypesInParentDefinition(): MTypeInParent[] {
        return ['mDivident', 'mDivisor'];
    }
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