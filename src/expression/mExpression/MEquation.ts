import { MTypeInParent } from "../../types";
import MExpression from "./MExpression";

export default class MEquation extends MExpression {
    protected childrenTypesInParentDefinition(): MTypeInParent[] {
        return ['mTerm1', 'mTerm2'];
    }
    public get mTerm1() {
        return super.getChild('mTerm1') as MExpression | undefined;
    }
    public set mTerm1(child: MExpression | undefined) {
        super.setChild('mTerm1', child);
    }
    public get mTerm2() {
        return super.getChild('mTerm2') as MExpression | undefined;
    }
    public set mTerm2(child: MExpression | undefined) {
        super.setChild('mTerm2', child);
    }
}