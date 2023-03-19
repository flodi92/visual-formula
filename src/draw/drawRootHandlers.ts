import { GAbstractRoot, GExpression } from "../expression/gExpression";
import getModification from "../modification/getModification";
import Modification from "../modification/Modification";
import { ID, ModificationType, XY } from "../types";
import { expressionToArray, find } from "../utils/expression";
import { MIN_DRAG_AND_DROP } from "./config";

const drawRootHandlers = ({
    root, selectedIDs = [undefined, undefined], setSelectedIDs, dragValue, dragContainer, hoveredID, setHoveredID, onModify,
}: {
    root?: GAbstractRoot,

    selectedIDs?: [ID | undefined, ID | undefined],
    setSelectedIDs: (val: [ID | undefined, ID | undefined]) => void,

    dragValue: ({ current: ID | undefined }),
    dragContainer: ({ current: { x?: number, y?: number } | undefined }),

    hoveredID: ID | undefined,
    setHoveredID: (val: ID | undefined) => void,

    onModify: (modification: Modification) => void,
}) => {

    const computeSelectedID = (clickedID: ID | undefined, selectedIDs: [ID | undefined, ID | undefined])
        : [ID | undefined, ID | undefined] => {
        if (clickedID === undefined) return [undefined, undefined];

        const [id1, id2] = selectedIDs;
        let buffer = root && find(clickedID, root);

        if (id1 === undefined && id2 === undefined) {
            return [clickedID, undefined];
        } else if (id1 !== undefined && id2 === undefined) {
            while (!!buffer && id1 !== undefined) {
                if (buffer.id === id1) {
                    return [buffer.parent?.id, undefined];
                }
                buffer = buffer.parent;
            }
            return [id1, clickedID];
        } else if (id1 !== undefined && id2 !== undefined) {
            while (!!buffer && id2 !== undefined) {
                if (buffer.id === id2) {
                    return [id1, buffer.parent?.id];
                }
                buffer = buffer.parent;
            }
            return [undefined, undefined];
        }

        return [undefined, undefined];
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
        if (!root) return;

        const selectedExpression = selectedIDs[0] !== undefined ? find(selectedIDs[0], root) : undefined;

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

        modification !== undefined && onModify(modification);
    }

    return {
        onClickID: (id: ID | undefined) => {
            setSelectedIDs(computeSelectedID(id, selectedIDs));
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
            if (!root) return;

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

            const selectedExpression = find(selectedIDs[0], root); // TODO use all ids;

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
                setSelectedIDs([undefined, undefined]);
            }

            dragContainer.current = ({ x: undefined, y: undefined });
            dragValue.current = (undefined);
        },

        onSelectedMouseDown: () => { },

        onSelectedMouseUp: () => { },

        onButtonModification: (type: ModificationType) =>
            onModify({ type, id: selectedIDs[0] }) // TODO all ids
    };
}

export default drawRootHandlers;