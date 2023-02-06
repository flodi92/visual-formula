import { ReactNode } from "react";
import AbstractDrawId from "../draw/AbstractDrawId";
import { FONT_SIZE } from "../draw/config";

class DrawId extends AbstractDrawId<ReactNode> {
    public render(): ReactNode {
        const { id, width = 0, height = 0, x = 0, y = 0, isTerm1 } = (this.gExpression || {});

        return <text
            x={x + 0.5 * width} y={y + 0.5 * height}
            fill={isTerm1 ? "blue" : "orange"}
            style={{ backgroundColor: "yellow", textDecoration: "underline", fontWeight: "bold" }}
            fontSize={`${FONT_SIZE * 0.8}px`}>
            {`${id}`}
        </text>
    }
    protected _empty(): ReactNode {
        return <></>
    }
}

export default DrawId;