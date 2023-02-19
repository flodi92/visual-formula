import { CSSProperties, ReactNode } from "react";
import { InteractionProps } from "../draw/AbstractDraw";
import AbstractDrawValue from "../draw/AbstractDrawValue";
import {
    CORNER_PADDING, DEFAULT_OPACITY, FONT_SIZE, GHOST_STROKE_WIDTH, G_COLOR_1, G_COLOR_2, HOVERED_OPACITY, HOVERED_SELECTED_OPACITY, ROUND_PADDING, SELECTED_OPACITY
} from "../draw/config";
import { GAbstractValue, GSimpleValue, GValue } from "../expression/gExpression";
import { MExpression } from "../expression/mExpression";
import { ID } from "../types";
import DrawMValue from "./DrawMValue";

class DrawValue extends AbstractDrawValue<ReactNode> {
    protected _renderRoundGValue({ id, coords: { a, ba, b, bc, c }, strokeWidth, isTerm1 }: {
        id?: ID;
        coords: { a?: [number, number]; ba?: [number, number]; b?: [number, number]; bc?: [number, number]; c?: [number, number]; };
        strokeWidth: number;
        isTerm1: boolean | undefined;
    }, props: InteractionProps): ReactNode {
        if (!id || !a || !ba || !b || !bc || !c) { return this._empty(); }

        const d = `M${a[0]},${a[1]} L${ba[0]},${ba[1]} Q${b[0]},${b[1]},${bc[0]},${bc[1]} L${c[0]},${c[1]}`;
        return (
            <g {...this.handlersOfId(id, props)}>
                <path
                    id={`path-${id}`}
                    key={`path-${id}`}
                    style={this.style(id, props)}
                    d={d} strokeWidth={strokeWidth}
                    stroke={isTerm1 ? G_COLOR_1 : G_COLOR_2}
                    fill="none" />
                <GhostPath {...{ id, d }} />
            </g>
        );
    }
    protected _renderNormedGValue({ id, coords: { a, ab, bc, c }, isTerm1, abStrokeWidth, bcStrokeWidth }: {
        id?: ID;
        coords: { a: [number, number], ab: [number, number], bc: [number, number], c: [number, number], },
        abStrokeWidth: number;
        bcStrokeWidth: number;
        isTerm1: boolean | undefined;
    }, props: InteractionProps): ReactNode {
        if (!id || !a || !ab || !bc || !c) { return this._empty(); }

        const d1 = `M${a[0]} ${a[1]} L${ab[0]} ${ab[1]}`;
        const d2 = `M${bc[0]} ${bc[1]} L${c[0]} ${c[1]}`;
        return (
            <g {...this.handlersOfId(id, props)}>
                <path
                    id={`path1-${id}`}
                    key={`path1-${id}`}
                    style={this.style(id, props)}
                    d={d1} strokeWidth={abStrokeWidth}
                    stroke={isTerm1 ? G_COLOR_1 : G_COLOR_2}
                    fill="none" />
                <path
                    id={`path2-${id}`}
                    key={`path2-${id}`}
                    style={this.style(id, props)}
                    d={d2} strokeWidth={bcStrokeWidth}
                    stroke={isTerm1 ? G_COLOR_1 : G_COLOR_2}
                    fill="none" />
                <GhostPath {...{ id, d: `${d1} ${d2}` }} />
            </g>
        )
    }
    protected _renderGSimpleValue({ id, coords: { x1, y1, x2, y2 }, strokeWidth, isTerm1, }: {
        id: number | undefined;
        coords: { x1: number; y1: number; x2: number; y2: number; };
        strokeWidth: number;
        isTerm1: boolean | undefined;
    }, props: InteractionProps): ReactNode {
        if (!id || !x1 || !y1 || !x2 || !y2) { return this._empty(); }

        const d = `M${x1} ${y1} L ${x2} ${y2}`;
        return (
            <g {...this.handlersOfId(id, props)}>
                <path
                    id={`path-${id}`}
                    key={`path-${id}`}
                    style={this.style(id, props)}
                    d={d} strokeWidth={strokeWidth}
                    stroke={isTerm1 ? G_COLOR_1 : G_COLOR_2}
                    strokeDasharray={"5,5"}
                    fill="none" />
                <GhostPath {...{ id, d }} />
            </g>
        );
    }

    protected _renderMExpression(mExpression?: MExpression): ReactNode {
        return (
            <DrawMValue mExpression={mExpression} />
        );
    };

    protected _renderMValueInGValue(gValue: GAbstractValue) {

        const positioning = gValue instanceof GSimpleValue && gValue.edge ? ({
            left: { top: "50%", left: 0 },
            right: { top: "50%", right: 0 },
            top: { left: "50%", top: 0 },
            bottom: { left: "50%", bottom: 0 },
        }[gValue.edge]) :
            gValue instanceof GValue ?
                ({
                    ...(gValue.yEdge === "left" ? { left: "0" } : { right: "0" }),
                    ...(gValue.xEdge === "top" ? { top: "0" } : { bottom: "0" }),
                }) : { top: 0, left: 0 };

        const padding = gValue.isNormX || gValue.isNormY ?
            CORNER_PADDING :
            ROUND_PADDING;

        const { x, y, width, height } = gValue;
        return <foreignObject {...{ x, y, width, height }} style={{ padding: 0 }}>
            <div
                style={{
                    width: `${width - 2 * padding}px`,
                    height: `${height - 2 * padding}px`,
                    margin: `${padding}px`,
                    position: "relative",
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        fontSize: `${FONT_SIZE}px`,
                        ...positioning,
                    }}
                >
                    {gValue instanceof GSimpleValue ?
                        this._renderMExpression(gValue.mSimpleValue) :
                        gValue instanceof GValue ?
                            this._renderMExpression(gValue.mValue)
                            : <></>}
                </div>
            </div>
        </foreignObject>
    }

    protected _empty(): ReactNode {
        return <></>;
    }

    private handlersOfId(id: ID, props: InteractionProps) {
        return ({
            onMouseEnter: () => props.onEnterID(id),
            onMouseLeave: () => props.onLeaveID(id),
            onClick: () => props.onClickID(id),
        })
    }

    private style(id: ID, props: InteractionProps): CSSProperties {
        return {

            filter: `opacity(${(
                id === props.hoveredID && id === props.selectedID ? HOVERED_SELECTED_OPACITY :
                    id === props.selectedID ? SELECTED_OPACITY :
                        id === props.hoveredID ? HOVERED_OPACITY
                            : DEFAULT_OPACITY
            )})`
        }
    }

    public render(props: InteractionProps): ReactNode {
        return (this.gExpression instanceof GValue) ?
            <>
                {this.renderGValue(this.gExpression, props)}
                {this._renderMValueInGValue(this.gExpression)}
            </>
            :
            (this.gExpression instanceof GSimpleValue) ?
                <>
                    {this.renderGSimpleValue(this.gExpression, props)}
                    {this._renderMValueInGValue(this.gExpression)}
                </> :
                <></>
    }
}

// invisible but providing more space for hovering an clicking
const GhostPath = ({ id, d }: { id: ID, d: string }) => (<path
    id={`ghost-${id}`}
    key={`ghost-${id}`}
    strokeWidth={GHOST_STROKE_WIDTH}
    d={d}
    stroke="black"
    style={{ filter: "opacity(0)" }}
    fill="none"
/>)

export default DrawValue;