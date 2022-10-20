import { MTypeInParent } from "../../types";
import MExpression from "./MExpression";

export default class MDifference extends MExpression {
    protected childrenTypesInParentDefinition(): MTypeInParent[] {
        return ['mMinuend', 'mSubtrahend'];
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