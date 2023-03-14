import { ReactNode } from "react";
import AbstractDrawZeros from "../draw/AbstractDrawZeros";

class DrawZeros extends AbstractDrawZeros<ReactNode> {
    protected renderZero({ x, y, r, isTerm1 }: { x: number; y: number; r: number; isTerm1?: boolean }): ReactNode {
        return <circle
            cx={x} cy={y} r={r}
            className={isTerm1 === true ? 'isTerm1' : isTerm1 === false ? 'isTerm2' : 'isTerm1'}
            fill="none"
        />
    }
    protected _empty(): ReactNode {
        return <></>
    }
}

export default DrawZeros;