import { MouseEvent } from "react";
import { InteractionProps } from "../draw/AbstractDraw";
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
            mousedownPos = [e.screenX, e.screenY];
        },
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

export const getInteractionClasses = (expression: Expression | undefined, props: InteractionProps | undefined): string => {


    const isSelected = ((_expression: Expression | undefined) => {
        if (props?.selectedID === undefined) return false;
        while (!!_expression) {
            if (_expression?.id === undefined) return false;
            if (_expression.id === props?.selectedID) return true;
            _expression = _expression.parent;
        }

        return false;
    })(expression)

    const isHovering = props?.hoveredID !== undefined && expression?.id === props?.hoveredID;

    const isTerm1 = expression?.isTerm1;

    return [
        isSelected ? 'isSelected' : undefined,
        isHovering ? 'isHovering' : undefined,
        isTerm1 === true ? 'isTerm1' : isTerm1 === false ? 'isTerm2' : 'isTerm1',
    ].filter(className => !!className).join(' ');

}