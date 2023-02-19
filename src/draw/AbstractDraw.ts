import Expression from "../expression/Expression";
import { ID } from "../types";

abstract class AbstractDraw<T, ExpressionT extends Expression> {
    constructor(public readonly gExpression: ExpressionT) { }

    protected abstract _empty(): T;

    public abstract render(props: InteractionProps): T;
}

export interface InteractionProps {
    onClickID: ((id: ID) => void),
    onEnterID: ((id: ID) => void),
    onLeaveID: ((id: ID) => void),
    hoveredID?: ID,
    selectedID?: ID,
}

export default AbstractDraw;