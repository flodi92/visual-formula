import { ReactNode } from "react";
import { InteractionProps } from "../draw/AbstractDraw";
import AbstractDrawOperators from "../draw/AbstractDrawOperators";
import {
    OPERATOR_OUTER_RADIUS as OORADIUS,
    OPERATOR_RADIUS as ORADIUS
} from "../draw/config";
import { ID, Operator } from "../types";
import { getInteractionClasses, handlersOfId } from "./drawUtils";

class DrawOperators extends AbstractDrawOperators<ReactNode> {
    protected renderOperator(
        { id, operatorPositions, operator, isTerm1 }: { id?: ID, operatorPositions: [number, number][]; operator: Operator; isTerm1: boolean | undefined; },
        props: InteractionProps): ReactNode {

        const circleProps = { r: 1, stroke: "transparent", fill: "black" }
        const lineProps = { stroke: "black" }

        return operatorPositions.map(([cx, cy]) =>
            <g className="operator" {...(handlersOfId(id, props))}>
                <circle {...{ cx, cy }} r={OORADIUS} fill="white" /> {/* white background because style has some opacity */}
                <circle {...{ cx, cy }} r={OORADIUS} stroke={"#000000"} strokeWidth={1}
                    className={getInteractionClasses(this.gExpression, props)}
                />
                {
                    {
                        '*': <circle {...{ cx, cy }} {...circleProps} />,
                        '+': <>
                            <line x1={cx - ORADIUS} y1={cy} x2={cx + ORADIUS} y2={cy} {...lineProps} />
                            <line x1={cx} y1={cy - ORADIUS} x2={cx} y2={cy + ORADIUS} {...lineProps} />

                        </>,
                        '-': <line x1={cx - ORADIUS} y1={cy} x2={cx + ORADIUS} y2={cy} {...lineProps} />,
                        '/': <>
                            <circle cx={cx} cy={cy + .5 * ORADIUS} {...circleProps} />
                            <circle cx={cx} cy={cy - .5 * ORADIUS} {...circleProps} />
                        </>,
                        '=': <>
                            <line x1={cx - ORADIUS} y1={cy - .5 * ORADIUS} x2={cx + ORADIUS} y2={cy - .5 * ORADIUS} {...lineProps} />
                            <line x1={cx - ORADIUS} y1={cy + .5 * ORADIUS} x2={cx + ORADIUS} y2={cy + .5 * ORADIUS} {...lineProps} />
                        </>,
                    }[operator]
                }
            </g>
        )
    }
    protected _empty(): ReactNode {
        return <></>
    }
}

export default DrawOperators;