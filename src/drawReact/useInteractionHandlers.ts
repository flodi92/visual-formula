import { RefObject, useLayoutEffect, useRef, useState } from "react";
import { cloneExpression } from "../conversion";
import drawRootHandlers from "../draw/drawRootHandlers";
import { GAbstractRoot } from "../expression/gExpression";
import { ID } from "../types";

const useInteractionHandlers = (initialRoot: GAbstractRoot) => {
    const [{ root }, setRoot] = useState({ root: cloneExpression(initialRoot, { isAdoptIDs: true }) });

    const [selectedID, setSelectedID] = useState<ID | undefined>();
    const [hoveredID, setHoveredID] = useState<ID | undefined>();

    const dragContainerRef = useRef<{ x?: number, y?: number }>();
    const dragValueRef = useRef<ID>();

    const svgRef: RefObject<SVGSVGElement> = useRef<SVGSVGElement>(null);

    useLayoutEffect(
        () => setRoot({ root: cloneExpression(initialRoot, { isAdoptIDs: true }) }),
        [JSON.stringify(initialRoot.json)]
    );

    return {
        hoveredID,
        selectedID,
        svgRef,
        root,
        ...drawRootHandlers({
            root,
            setRoot: root => setRoot({ root }),
            selectedID,
            setSelectedID,
            dragValue: dragValueRef,
            dragContainer: dragContainerRef,
            hoveredID,
            setHoveredID,
            getBox: () => ({
                width: svgRef.current?.width.animVal.value || 0,
                height: svgRef.current?.height.animVal.value || 0
            })
        }),
    };
}

export default useInteractionHandlers;