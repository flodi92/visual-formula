import { ReactNode } from "react";
import { GAbstractValue, GSimpleValue, GValue } from "../expression/gExpression";
import { MExpression } from "../expression/mExpression";
import AbstractDrawValue from "../draw/AbstractDrawValue";
import { CORNER_PADDING, FONT_SIZE, G_COLOR_1, G_COLOR_2, NORM_STROKE_WIDHT, ROUND_PADDING, STANDARD_STROKE_WIDHT } from "../draw/config";
import DrawMValue from "./DrawMValue";

class DrawValue extends AbstractDrawValue<ReactNode> {
    protected _empty(): ReactNode {
        return <></>;
    }

    protected _renderRoundGValue({ id, coords: { a, ba, b, bc, c }, strokeWidth, isTerm1 }: {
        id?: number;
        coords: { a?: [number, number]; ba?: [number, number]; b?: [number, number]; bc?: [number, number]; c?: [number, number]; };
        strokeWidth: number;
        isTerm1: boolean | undefined;
    }): ReactNode {
        if (!id || !a || !ba || !b || !bc || !c) { return this._empty(); }

        const d = `M${a[0]},${a[1]} L${ba[0]},${ba[1]} Q${b[0]},${b[1]},${bc[0]},${bc[1]} L${c[0]},${c[1]}`;
        return (
            <path
                id={`path-${id}`}
                key={`path-${id}`}
                d={d} strokeWidth={strokeWidth}
                stroke={isTerm1 ? G_COLOR_1 : G_COLOR_2}
                fill="none" />
        );
    }
    protected _renderNormedGValue({ id, coords: { a, b, c }, strokeWidth, isTerm1, isABNorm, isBCNorm }: {
        id?: number;
        coords: { a: [number, number]; b: [number, number]; c: [number, number]; };
        strokeWidth: number;
        isTerm1: boolean | undefined;
        isABNorm: boolean;
        isBCNorm: boolean;
    }): ReactNode {
        const abStroke = isABNorm ? NORM_STROKE_WIDHT : STANDARD_STROKE_WIDHT;
        const bcStroke = isBCNorm ? NORM_STROKE_WIDHT : STANDARD_STROKE_WIDHT;

        const adjustCorner = (j: [number, number], k: [number, number], delta: number) => {

            const [[jx, kx], [jy, ky]] = [[j[0], k[0]], [j[1], k[1]]]
                .map(([j, k]) => j === k ? [j, k] : [j, k + Math.sign(k - j) * delta]);

            return [jx, jy, kx, ky];
        }

        const [ax, ay, bx1, by1] = adjustCorner(a, b, bcStroke * 0.5);
        const [cx, cy, bx2, by2] = adjustCorner(c, b, -abStroke * 0.5);

        const d1 = `M${ax} ${ay} L${bx1} ${by1}`;
        const d2 = `M${cx} ${cy} L${bx2} ${by2}`;

        return (
            <>
                <path
                    id={`path1-${id}`}
                    key={`path1-${id}`}
                    d={d1} strokeWidth={abStroke}
                    stroke={isTerm1 ? G_COLOR_1 : G_COLOR_2}
                    fill="none" />
                <path
                    id={`path2-${id}`}
                    key={`path2-${id}`}
                    d={d2} strokeWidth={bcStroke}
                    stroke={isTerm1 ? G_COLOR_1 : G_COLOR_2}
                    fill="none" />
            </>
        )
    }
    protected _renderGSimpleValue({ id, coords: { x1, y1, x2, y2 }, strokeWidth, isTerm1, }: {
        id: number | undefined;
        coords: { x1: number; y1: number; x2: number; y2: number; };
        strokeWidth: number;
        isTerm1: boolean | undefined;
    }): ReactNode {
        const d = `M${x1} ${y1} L ${x2} ${y2}`;
        return (
            <path
                id={`path-${id}`}
                key={`path-${id}`}
                d={d} strokeWidth={STANDARD_STROKE_WIDHT}
                stroke={isTerm1 ? G_COLOR_1 : G_COLOR_2}
                strokeDasharray={"5,5"}
                fill="none" />
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

    public render(): ReactNode {
        return (this.gExpression instanceof GValue) ?
            <>
                {this.renderGValue(this.gExpression)}
                {this._renderMValueInGValue(this.gExpression)}
            </>
            :
            (this.gExpression instanceof GSimpleValue) ?
                <>
                    {this.renderGSimpleValue(this.gExpression)}
                    {this._renderMValueInGValue(this.gExpression)}
                </> :
                <></>
    }
}

export default DrawValue;