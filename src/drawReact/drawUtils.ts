import { CSSProperties, MouseEvent, MouseEventHandler } from "react";
import { InteractionProps } from "../draw/AbstractDraw";
import { DEFAULT_OPACITY, HOVERED_OPACITY, HOVERED_SELECTED_OPACITY, SELECTED_OPACITY } from "../draw/config";
import Expression from "../expression/Expression";
import { ID } from "../types";

export const handlersOfId = (id: ID | undefined, props: InteractionProps | undefined) => {
    return id !== undefined ? ({
        onMouseEnter: () => props?.onEnterID(id),
        onMouseLeave: () => props?.onLeaveID(id),
        onClick: (e: MouseEvent<SVGGElement>) => {
            e.stopPropagation();
            props?.onClickID(id);
        },
    }) : ({
        onMouseEnter: () => { },
        onMouseLeave: () => { },
        onClick: () => { },
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
        )})`
    }
}