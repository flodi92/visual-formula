import Expression from "../expression/Expression";

abstract class AbstractDraw<T, ExpressionT extends Expression> {
    constructor(public readonly gExpression: ExpressionT) { }

    protected abstract _empty(): T;
    public abstract render(): T;
}

export default AbstractDraw;