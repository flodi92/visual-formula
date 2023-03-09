import { ReactNode, RefObject } from "react";
import { InteractionProps } from "../draw/AbstractDraw";
import AbstractDrawRoot from "../draw/AbstractDrawRoot";
import { RESULT_COLOR, SELECTED_COLOR } from "../draw/config";
import { GAbstractRoot, GDifference, GExpression, GProduct1D, GProduct2D, GQuotient1D, GQuotient2D, GSum } from "../expression/gExpression";
import { expressionToArray, find } from "../utils/expression";
import { getGAbstractValues } from "../utils/gExpression";
import DrawId from "./DrawId";
import DrawOperators from "./DrawOperators";
import DrawValue from "./DrawValue";
import DrawZeros from "./DrawZeros";

type DrawRootProps = InteractionProps & {
    onMouseDownContainer?: (x: number, y: number) => void,
    onMouseUpContainer?: (x: number, y: number) => void,
    onSelectedMouseDown?: () => void,
    onSelectedMouseUp?: () => void,
    svgRef?: RefObject<SVGSVGElement>,
};

class _DrawRoot extends AbstractDrawRoot<ReactNode, any> {
    protected _empty(): ReactNode { return <></> }
    public render(props: DrawRootProps): ReactNode {
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
                    props?.onSelectedMouseDown && props.onSelectedMouseDown();
                }}
                onMouseUp={e => {
                    e.preventDefault();
                    props?.onSelectedMouseUp && props.onSelectedMouseUp();
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
                const { left, top } = e.currentTarget.getBoundingClientRect();
                props?.onMouseDownContainer && props.onMouseDownContainer(e.clientX - left, e.clientY - top);
            }}
            onMouseUp={e => {
                const { left, top } = e.currentTarget.getBoundingClientRect();
                props?.onMouseUpContainer && props.onMouseUpContainer(e.clientX - left, e.clientY - top);
            }}
            ref={props.svgRef}
        >
            {resultRect}
            {selectedRect}
            {drawValues.map((drawValue, idx) => <g key={idx}>{drawValue.render(props)}</g>)}
            {drawOperators.map((drawOperator, idx) => <g key={idx}>{drawOperator.render(props)}</g>)}
            {drawZero.render()}
            {drawnIds.map((drawnId, idx) => <g key={idx}>{drawnId.render()}</g>)}
        </svg>
    }
}

const DrawRoot = ({
    root,
    style,
    drawIds = false,
    onClickID = () => { },
    onEnterID = () => { },
    onLeaveID = () => { },
    onMouseDownContainer = () => { },
    onMouseDownID = () => { },
    onMouseUpContainer = () => { },
    onSelectedMouseDown = () => { },
    onSelectedMouseUp = () => { },
    svgRef,
    hoveredID,
    selectedID,
}: DrawRootProps & {
    root: GAbstractRoot,
    style: any,
    drawIds?: boolean,
}) => {
    const drawRoot = new _DrawRoot(root, style, drawIds);

    return <>{drawRoot.render({
        onClickID,
        onEnterID,
        onLeaveID,
        onMouseDownContainer,
        onMouseDownID,
        onMouseUpContainer,
        onSelectedMouseDown,
        onSelectedMouseUp,
        svgRef,
        hoveredID,
        selectedID,
    })}</>;
}

export default DrawRoot;