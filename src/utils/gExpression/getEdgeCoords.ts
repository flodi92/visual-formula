import { GAbstractValue, GValue, GSimpleValue } from "../../expression/gExpression";
import { ALL_DIRECTIONS, Direction } from "../../types";

const getEdgeCoords = (gValue: GAbstractValue, isTestPossible: boolean = false) => {
    const { unscaledX: x1, unscaledY: y1, unscaledWidth: w = 0, unscaledHeight: h = 0 } = gValue;
    const [x2, y2] = [x1 + w, y1 + h];

    const edges = isTestPossible ? ALL_DIRECTIONS :
        gValue instanceof GValue ? [gValue.xEdge, gValue.yEdge] :
            gValue instanceof GSimpleValue ? [gValue.edge] :
                []
    
    return (edges.filter(edge => !!edge) as Direction[]).map(edge => (
        edge === "top" ? [[x1, y1, 'left'], [x2, y1, 'right'], 'top'] :
            edge === "right" ? [[x2, y1, 'top'], [x2, y2, 'bottom'], 'right'] :
                edge === "bottom" ? [[x1, y2, 'left'], [x2, y2, 'right'], 'bottom'] :
                    /* edge === "left" */[[x1, y1, 'top'], [x1, y2, 'bottom'], 'left']
    )) as [[number, number, Direction], [number, number, Direction], Direction][]
};

export default getEdgeCoords;