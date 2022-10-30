import GExpression from "./GExpression";
import GAbstractRoot from "./GAbstractRoot";
import { TypeInParent } from "../../types";

export default class GTerm extends GAbstractRoot {
    protected childrenTypesInParentDefinition(): TypeInParent[] {
        return ["gTerm"];
    }
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