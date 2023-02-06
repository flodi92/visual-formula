import { ReactNode } from "react";
import { GAbstractRoot, GExpression } from "../expression/gExpression";
import { expressionToArray } from "../utils/expression";
import { getGAbstractValues } from "../utils/gExpression";
import AbstractDrawRoot from "../draw/AbstractDrawRoot";
import DrawId from "./DrawId";
import DrawValue from "./DrawValue";
import DrawZeros from "./DrawZeros";

class _DrawRoot extends AbstractDrawRoot<ReactNode, any> {
    protected _empty(): ReactNode { return <></> }
    public render(): ReactNode {
        const gAValues = getGAbstractValues(this.gExpression);
        const drawValues: DrawValue[] = gAValues.map(gaValue => new DrawValue(gaValue));

        const drawZero = new DrawZeros(this.gExpression);

        const drawnIds: DrawId[] = this.drawIds ? (expressionToArray(this.gExpression)
            .map(expression => expression instanceof GExpression ? new DrawId(expression) : null)
            .filter(val => val !== null)) as DrawId[] : [];

        return <svg {...{ style: this.style }}>
            <rect
                fill='#88888844'
                {...{
                    x: this.gExpression.x,
                    y: this.gExpression.y,
                    width: this.gExpression.width,
                    height: this.gExpression.height
                }}
            />
            {drawValues.map((drawValue, idx) => <g key={idx}>{drawValue.render()}</g>)}
            {drawZero.render()}
            {drawnIds.map((drawnId, idx) => <g key={idx}>{drawnId.render()}</g>)}
        </svg>
    }
}

const DrawRoot = ({ root, style, drawIds = false, }: { root: GAbstractRoot, style: any, drawIds?: boolean }) => {
    const drawRoot = new _DrawRoot(root, style, drawIds)

    return <>{drawRoot.render()}</>;
}

export default DrawRoot;