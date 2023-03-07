import { ReactNode, useLayoutEffect, useRef, useState } from "react";
import { InteractionProps } from "../draw/AbstractDraw";
import AbstractDrawRoot from "../draw/AbstractDrawRoot";
import { RESULT_COLOR, SELECTED_COLOR } from "../draw/config";
import drawRootHandlers from "../draw/drawRootHandlers";
import { GAbstractRoot, GDifference, GExpression, GProduct1D, GProduct2D, GQuotient1D, GQuotient2D, GSum } from "../expression/gExpression";
import Modification from "../modification/Modification";
import { ID } from "../types";
import { expressionToArray, find } from "../utils/expression";
import { getGAbstractValues } from "../utils/gExpression";
import DrawId from "./DrawId";
import DrawOperators from "./DrawOperators";
import DrawValue from "./DrawValue";
import DrawZeros from "./DrawZeros";

class _DrawRoot extends AbstractDrawRoot<ReactNode, any> {
    protected _empty(): ReactNode { return <></> }
    public render(props: InteractionProps & {
        onMouseDownContainer: (x: number, y: number) => void,
        onMouseUpContainer: (x: number, y: number) => void,
        onSelectedMouseDown: () => void,
        onSelectedMouseUp: () => void,
    }): ReactNode {
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
                onMouseDown={e => {
                    e.preventDefault();
                    props.onSelectedMouseDown();
                }}
                onMouseUp={e => {
                    e.preventDefault();
                    props.onSelectedMouseUp();
                }}
                {...{
                    x: selectedGExpression.x,
                    y: selectedGExpression.y,
                    width: selectedGExpression.width,
                    height: selectedGExpression.height
                }}
            />
            : <></>;

        return <svg {...{ style: this.style }}
            onMouseDown={(e) => {
                props.onMouseDownContainer(e.clientX - 16, e.clientY - 30); // TODO better determination of position
            }}
            onMouseUp={e => {
                props.onMouseUpContainer(e.clientX - 16, e.clientY - 30);
            }}
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

const DrawRoot = ({ root: _root, style, drawIds = false, onModify = () => { } }: {
    root: GAbstractRoot,
    style: any,
    drawIds?: boolean,
    onModify?: ((modification?: Modification) => void)
}) => {
    const [{ root }, setRoot] = useState({ root: _root });
    useLayoutEffect(() => setRoot({ root: _root }), [_root]);

    const [selectedID, setSelectedID] = useState<ID | undefined>();
    const [hoveredID, setHoveredID] = useState<ID | undefined>();

    const dragContainerRef = useRef<{ x?: number, y?: number }>();
    const dragValueRef = useRef<ID>();

    const drawRoot = new _DrawRoot(root, style, drawIds);

    return <>{drawRoot.render(
        {
            ...drawRootHandlers({
                root,
                setRoot: root => setRoot({ root }),
                selectedID,
                setSelectedID,
                dragValue: dragValueRef,
                dragContainer: dragContainerRef,
                hoveredID,
                setHoveredID,
            }),
            hoveredID,
            selectedID,
        }
    )}</>;
}

export default DrawRoot;