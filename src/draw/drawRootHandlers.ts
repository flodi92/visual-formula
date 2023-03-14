import Expression from "../expression/Expression";
import { GAbstractRoot, GExpression } from "../expression/gExpression";
import { expressionToArray, find } from "../utils/expression";
import getModification from "../modification/getModification";
import Modification from "../modification/Modification";
import modify from "../modification/modify";
import { ID, ModificationType, XY } from "../types";
import { MIN_DRAG_AND_DROP } from "./config";

const drawRootHandlers = ({
    root, setRoot, selectedID, setSelectedID, dragValue, dragContainer, hoveredID, setHoveredID, getBox
}: {
    root: GAbstractRoot,
    setRoot: (val: GAbstractRoot) => void,

    selectedID: ID | undefined,
    setSelectedID: (val: ID | undefined) => void,

    dragValue: ({ current: ID | undefined }),
    dragContainer: ({ current: { x?: number, y?: number } | undefined }),

    hoveredID: ID | undefined,
    setHoveredID: (val: ID | undefined) => void,

    getBox: () => { width: number, height: number }
}) => {

    const computeSelectedID = (newID: ID | undefined, oldID: ID | undefined): ID | undefined => {
        if (newID === undefined) return undefined;

        let buffer: Expression | undefined = root && find(newID, root);

        while (!!buffer && oldID !== undefined) {
            if (buffer.id === oldID) {
                return buffer.parent?.id;
            }
            buffer = buffer.parent;
        }

        return newID
    }

    const handleModify = (modification: Modification) => {
        modify(root, modification, getBox());
        setRoot(root);
    }

    const handleTryModify = ({ dropExpressions, dragExpressions, isDragSelected, isDropSelected, isDragResult, isDropResult, dragXY }: {
        dropExpressions?: GExpression[],
        dragExpressions?: GExpression[],
        isDragSelected?: boolean,
        isDropSelected?: boolean,

        isDragResult?: boolean,
        isDropResult?: boolean,

        dragXY?: XY,
    }) => {
        const selectedExpression = selectedID !== undefined ? find(selectedID, root) : undefined;

        const modification = getModification({
            selectedExpression,
            dropExpressions,
            dragExpressions,
            isDragSelected,
            isDropSelected,
            isDragResult,
            isDropResult,
            dragXY,
        });

        modification !== undefined && handleModify(modification);
    }

    return {
        onClickID: (id: ID | undefined) => {
            setSelectedID(computeSelectedID(id, selectedID));
            dragValue.current = (undefined);
        },

        onEnterID: (id: ID) => setHoveredID(id),

        onLeaveID: (id: ID) => setHoveredID(undefined),

        onMouseDownID: (id: ID) => {
            dragValue.current = (id);
        },

        onMouseDownContainer: (x: number, y: number) => {
            dragContainer.current = ({ x, y });
        },

        onMouseUpContainer: (x: number, y: number) => {
            const { x: _x, y: _y } = dragContainer.current || {};

            if (_x === undefined || _y === undefined) return;

            const withinRange = ({ x: _x, y: _y }: { x: number, y: number }, gExpression: GExpression | undefined, isConsole: boolean = false) => {
                if (!gExpression) { return false; }
                const { x, y, width, height } = gExpression;

                return x < _x && x + width > _x
                    && y < _y && y + height > _y;
            }

            const dragExpressions = expressionToArray(root)
                .filter(gExpression => gExpression instanceof GExpression
                    && withinRange({ x: _x, y: _y }, gExpression)
                ) as GExpression[];

            const dropExpressions = expressionToArray(root)
                .filter(gExpression => gExpression instanceof GExpression
                    && withinRange({ x, y }, gExpression)
                ) as GExpression[];

            const selectedExpression = find(selectedID, root);

            const isDragSelected = (selectedExpression instanceof GExpression)
                && withinRange({ x: _x, y: _y }, selectedExpression);

            const isDropSelected = (selectedExpression instanceof GExpression)
                && withinRange({ x, y }, selectedExpression);

            const isDragResult = withinRange({ x: _x, y: _y }, root);

            const isDropResult = withinRange({ x, y }, root);

            const [absDx, absDy] = [Math.abs(x - _x), Math.abs(y - _y)];
            const dragXY: XY = absDx > absDy ? 'X' : 'Y'

            if (Math.max(absDx, absDy) > MIN_DRAG_AND_DROP) {
                handleTryModify({
                    dragExpressions,
                    dropExpressions,
                    isDragSelected,
                    isDropSelected,
                    isDragResult,
                    isDropResult,
                    dragXY,
                });
            } else {
                setSelectedID(undefined);
            }

            dragContainer.current = ({ x: undefined, y: undefined });
            dragValue.current = (undefined);
        },

        onSelectedMouseDown: () => { },

        onSelectedMouseUp: () => { },

        onButtonModification: (type: ModificationType) =>
            handleModify({ type, id: selectedID })
    };
}

export default drawRootHandlers;