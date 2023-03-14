import { RefObject, useLayoutEffect, useRef, useState } from "react";
import { cloneExpression } from "../conversion";
import drawRootHandlers from "../draw/drawRootHandlers";
import { GAbstractRoot } from "../expression/gExpression";
import ExpressionManager from "../expressionManager/ExpressionManager";
import Modification from "../modification/Modification";
import { ID } from "../types";

const useInteractionHandlers = (initialRoot: GAbstractRoot) => {
    const { current: expressionManager } = useRef<ExpressionManager>(new ExpressionManager())

    const [{ root, selectedID, hoveredID }, setState]
        = useState<{ root?: GAbstractRoot, selectedID?: ID | undefined, hoveredID?: ID | undefined }>({});

    const setRoot = (root?: GAbstractRoot) => setState({ root, selectedID, hoveredID })
    const setSelectedID = (selectedID?: ID) => setState({ root, selectedID, hoveredID })
    const setHoveredID = (hoveredID?: ID) => setState({ root, selectedID, hoveredID })

    const dragContainerRef = useRef<{ x?: number, y?: number }>();
    const dragValueRef = useRef<ID>();

    const svgRef: RefObject<SVGSVGElement> = useRef<SVGSVGElement>(null);

    useLayoutEffect(
        () => {
            expressionManager.init(cloneExpression(initialRoot, { isAdoptIDs: true }))
            setRoot(expressionManager.root);
            expressionManager.getBox = () => ({
                width: svgRef.current?.width.animVal.value || 0,
                height: svgRef.current?.height.animVal.value || 0
            });
        },
        [JSON.stringify(initialRoot.json)]
    );

    const handleModify = (modification: Modification) => {
        const success = expressionManager.modify(modification);
        setRoot(expressionManager.root)
        return success;
    }

    const handleForward = () => {
        expressionManager.forward()
        setRoot(expressionManager.root)
    };

    const handleBackward = () => {
        expressionManager.backward()
        setRoot(expressionManager.root)
    };

    return {
        hoveredID,
        selectedID,
        svgRef,
        root,
        onForward: handleForward,
        onBackward: handleBackward,
        ...drawRootHandlers({
            root,
            onModify: handleModify,
            selectedID,
            setSelectedID,
            dragValue: dragValueRef,
            dragContainer: dragContainerRef,
            hoveredID,
            setHoveredID,
        }),
    };
}

export default useInteractionHandlers;