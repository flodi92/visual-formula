import { GAbstractRoot } from "../expression/gExpression";
import AbstractDraw from "./AbstractDraw";

abstract class AbstractDrawRoot<T, StyleT> extends AbstractDraw<T, GAbstractRoot> {
    constructor(
        gExpression: GAbstractRoot,
        protected readonly style: StyleT,
        protected readonly drawIds: boolean = false) {
            super(gExpression);
         }
}

export default AbstractDrawRoot;