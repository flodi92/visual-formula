import { RefObject, useLayoutEffect, useRef, useState } from "react";
import { cloneExpression } from "../conversion";
import drawRootHandlers from "../draw/drawRootHandlers";
import { GAbstractRoot } from "../expression/gExpression";
import ExpressionManager from "../expressionManager/ExpressionManager";
import Modification from "../modification/Modification";
import { ID } from "../types";

const useInteractionHandlers = (initialRoot: GAbstractRoot, initialModifications: Modification[] = []) => {
    const { current: expressionManager } = useRef<ExpressionManager>(new ExpressionManager())

    const [{ root, selectedIDs, hoveredID }, setState]
        = useState<{ root?: GAbstractRoot, selectedIDs?: [ID | undefined, ID | undefined], hoveredID?: ID | undefined }>({});

    const setRoot = (root?: GAbstractRoot) => setState({ root, selectedIDs, hoveredID })
    const setSelectedIDs = (selectedIDs?: [ID | undefined, ID | undefined]) => setState({ root, selectedIDs, hoveredID })
    const setHoveredID = (hoveredID?: ID) => setState({ root, selectedIDs, hoveredID })

    const dragContainerRef = useRef<{ x?: number, y?: number }>();
    const dragValueRef = useRef<ID>();

    const svgRef: RefObject<SVGSVGElement> = useRef<SVGSVGElement>(null);

    useLayoutEffect(
        () => {
            expressionManager.init(cloneExpression(initialRoot, { isAdoptIDs: true }))
            if (!!initialModifications?.length) { handleModify(...initialModifications); }
            setRoot(expressionManager.root);
            expressionManager.getBox = () => ({
                width: svgRef.current?.width.animVal.value || 0,
                height: svgRef.current?.height.animVal.value || 0
            });

        },
        [JSON.stringify(initialRoot.json) + JSON.stringify(initialModifications)]
    );

    const handleModify = (...modifications: Modification[]) => {
        for (let idx = 0; idx < modifications.length; idx++) {
            const success = expressionManager.modify(modifications[idx]);
            if (!success) {
                setRoot(expressionManager.root)
                return false;
            }
        }

        setRoot(expressionManager.root)
        return true;
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
        selectedIDs,
        svgRef,
        root,
        onForward: handleForward,
        onBackward: handleBackward,
        ...drawRootHandlers({
            root,
            onModify: handleModify,
            selectedIDs,
            setSelectedIDs,
            dragValue: dragValueRef,
            dragContainer: dragContainerRef,
            hoveredID,
            setHoveredID,
        }),
    };
}

export default useInteractionHandlers;