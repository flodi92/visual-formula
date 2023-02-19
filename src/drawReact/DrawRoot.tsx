import { ReactNode, useState } from "react";
import { GAbstractRoot, GExpression } from "../expression/gExpression";
import { expressionToArray, find } from "../utils/expression";
import { getGAbstractValues } from "../utils/gExpression";
import AbstractDrawRoot from "../draw/AbstractDrawRoot";
import DrawId from "./DrawId";
import DrawValue from "./DrawValue";
import DrawZeros from "./DrawZeros";
import { RESULT_COLOR, SELECTED_COLOR } from "../draw/config";
import { ID } from "../types";
import { InteractionProps } from "../draw/AbstractDraw";

class _DrawRoot extends AbstractDrawRoot<ReactNode, any> {
    protected _empty(): ReactNode { return <></> }
    public render(props: InteractionProps): ReactNode {
        const gAValues = getGAbstractValues(this.gExpression);
        const drawValues: DrawValue[] = gAValues.map(gaValue => new DrawValue(gaValue));

        const drawZero = new DrawZeros(this.gExpression);

        const drawnIds: DrawId[] = this.drawIds ? (expressionToArray(this.gExpression)
            .map(expression => expression instanceof GExpression ? new DrawId(expression) : null)
            .filter(val => val !== null)) as DrawId[] : [];

        const resultRect = <rect
            fill={RESULT_COLOR}
            {...{
                x: this.gExpression.x,
                y: this.gExpression.y,
                width: this.gExpression.width,
                height: this.gExpression.height
            }}
        />;

        const selectedGExpression = props.selectedID !== undefined ? find(props.selectedID, this.gExpression) : undefined;
        const selectedRect = (selectedGExpression instanceof GExpression) ?
            <rect
                fill={SELECTED_COLOR}
                {...{
                    x: selectedGExpression.x,
                    y: selectedGExpression.y,
                    width: selectedGExpression.width,
                    height: selectedGExpression.height
                }}
            />
            : <></>;

        return <svg {...{ style: this.style }}>
            {resultRect}
            {selectedRect}
            {drawValues.map((drawValue, idx) => <g key={idx}>{drawValue.render(props)}</g>)}
            {drawZero.render()}
            {drawnIds.map((drawnId, idx) => <g key={idx}>{drawnId.render()}</g>)}
        </svg>
    }
}

const DrawRoot = ({ root, style, drawIds = false, }: { root: GAbstractRoot, style: any, drawIds?: boolean }) => {
    const drawRoot = new _DrawRoot(root, style, drawIds)


    const [hoveredID, setHoveredID] = useState<ID | undefined>();
    const [selectedID, setSelectedID] = useState<ID | undefined>();

    return <>{drawRoot.render(
        {
            onClickID: id => setSelectedID(selectedID === undefined ? id : undefined),
            onEnterID: id => setHoveredID(id),
            onLeaveID: () => setHoveredID(undefined),
            hoveredID,
            selectedID,
        }
    )}</>;
}

export default DrawRoot;