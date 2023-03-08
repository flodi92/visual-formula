import { CSSProperties, MouseEvent } from "react";
import { InteractionProps } from "../draw/AbstractDraw";
import { DEFAULT_OPACITY, HOVERED_OPACITY, HOVERED_SELECTED_OPACITY, SELECTED_OPACITY, SELECTED_TEXT_COLOR } from "../draw/config";
import Expression from "../expression/Expression";
import { ID } from "../types";

let mouseDownId: ID | undefined;
let mousedownPos: [number, number] = [-1, -1];

export const handlersOfId = (id: ID | undefined, props: InteractionProps | undefined) => {
    return id !== undefined ? ({
        onMouseEnter: () => props?.onEnterID && props.onEnterID(id),
        onMouseLeave: () => props?.onLeaveID && props.onLeaveID(id),
        onMouseDown: (e: MouseEvent<SVGGElement>) => {
            props?.onMouseDownID && props.onMouseDownID(id);
            mouseDownId = id;
            mousedownPos = [e.screenX, e.screenY];        },
        onMouseUp: (e: MouseEvent<SVGGElement>) => {
            
            if (mouseDownId === id && mousedownPos[0] === e.screenX && mousedownPos[1] === e.screenY) {
                props?.onClickID && props.onClickID(id);
                e.stopPropagation();
                e.preventDefault();
            }
        },
    }) : ({
        onMouseEnter: () => { },
        onMouseLeave: () => { },
        onMouseDown: () => { },
        onMouseUp: () => { },
    })
}

export const interactionStyle = (expression: Expression | undefined, props: InteractionProps | undefined): CSSProperties => {
    const isSelected = (() => {
        if (expression?.id === undefined) return false;

        while (!!expression) {
            if (expression.id === props?.selectedID) return true;
            expression = expression.parent;
        }

        return false;
    })()

    const isHovering = expression?.id === props?.hoveredID;

    return {
        filter: `opacity(${(
            isHovering && isSelected ? HOVERED_SELECTED_OPACITY :
                isSelected ? SELECTED_OPACITY :
                    isHovering ? HOVERED_OPACITY
                        : DEFAULT_OPACITY
        )})`,
        backgroundColor: isSelected ? SELECTED_TEXT_COLOR : undefined,
    }
}