import { ReactNode, useState } from "react";
import { GAbstractRoot, GDifference, GExpression, GProduct1D, GProduct2D, GQuotient1D, GQuotient2D, GSum } from "../expression/gExpression";
import { expressionToArray, find } from "../utils/expression";
import { getGAbstractValues } from "../utils/gExpression";
import AbstractDrawRoot from "../draw/AbstractDrawRoot";
import DrawId from "./DrawId";
import DrawValue from "./DrawValue";
import DrawZeros from "./DrawZeros";
import { RESULT_COLOR, SELECTED_COLOR } from "../draw/config";
import { ID } from "../types";
import { InteractionProps } from "../draw/AbstractDraw";
import Expression from "../expression/Expression";
import DrawOperators from "./DrawOperators";

class _DrawRoot extends AbstractDrawRoot<ReactNode, any> {
    protected _empty(): ReactNode { return <></> }
    public render(props: InteractionProps): ReactNode {
        const gAValues = getGAbstractValues(this.gExpression);
        const drawValues: DrawValue[] = gAValues.map(gaValue => new DrawValue(gaValue));

        const drawZero = new DrawZeros(this.gExpression);

        const drawnIds: DrawId[] = this.drawIds ? (expressionToArray(this.gExpression)
            .map(expression => expression instanceof GExpression ? new DrawId(expression) : null)
            .filter(val => val !== null)) as DrawId[] : [];

        const drawOperators = (expressionToArray(this.gExpression)
            .filter(expression => !!expression && (
                (expression instanceof GSum)
                || (expression instanceof GDifference)
                || (expression instanceof GProduct1D)
                || (expression instanceof GQuotient1D)
                || (expression instanceof GProduct2D)
                || (expression instanceof GQuotient2D)
            )) as GExpression[])
            .map(expression => new DrawOperators(expression))

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

        return <svg {...{ style: this.style }}
            onClick={() => props.onClickID(undefined)}
        >
            {resultRect}
            {selectedRect}
            {drawValues.map((drawValue, idx) => drawValue.render(props))}
            {drawOperators.map(drawOperator => drawOperator.render(props))}
            {drawZero.render()}
            {drawnIds.map((drawnId, idx) => drawnId.render())}
        </svg>
    }
}

const DrawRoot = ({ root, style, drawIds = false, }: { root: GAbstractRoot, style: any, drawIds?: boolean }) => {
    const drawRoot = new _DrawRoot(root, style, drawIds)

    const computeSelectedID = (newID: ID | undefined, oldID: ID | undefined): ID | undefined => {
        if (newID === undefined) return undefined;

        let buffer: Expression | undefined = find(newID, root);

        while (!!buffer && oldID !== undefined) {
            if (buffer.id === oldID) {
                return buffer.parent?.id;
            }
            buffer = buffer.parent;
        }

        return newID
    }

    const [hoveredID, setHoveredID] = useState<ID | undefined>();
    const [selectedID, setSelectedID] = useState<ID | undefined>();

    return <>{drawRoot.render(
        {
            onClickID: id => setSelectedID(computeSelectedID(id, selectedID)),
            onEnterID: id => setHoveredID(id),
            onLeaveID: () => setHoveredID(undefined),
            hoveredID,
            selectedID,
        }
    )}</>;
}

export default DrawRoot;