import { GAbstractRoot } from "../expression/gExpression";
import { ID } from "../types";
import { find } from "../utils/expression";
import { getMinMaxCoordinates } from "../utils/gExpression";

const autoAdaptTransformation = (
    { gRoot, modifiedID, width, height, padding }
        : { gRoot: GAbstractRoot, modifiedID?: ID, width: number, height: number, padding: number },
    transformation: () => boolean = () => false
) => {
    const viewBox = { minX: padding, minY: padding, maxX: width - padding, maxY: height - padding };

    // store coordinates before transformation ////////////////////////////////////////////////////

    const modifiedChild = find(modifiedID, gRoot);
    const [oldX, oldY] = [modifiedChild.x, modifiedChild.y];

    // transformation ///////////////////////////////////////////////////////////////////////////////

    transformation();

    // adoption 1: try to keep position of modifiedChild ////////////////////////////////////////////

    const [newX, newY] = [modifiedChild.x, modifiedChild.y];

    const { x: resultX1, y: resultY1, ...scales1 } = gRoot.layerTransformation;

    gRoot.layerTransformation = {
        x: resultX1 + (newX - oldX),
        y: resultY1 + (newY - oldY),
        ...scales1,
    };

    // adoption 2: size down if necessary /////////////////////////////////////////////////////////

    const extrems2 = getMinMaxCoordinates(gRoot);

    const changeScale = Math.min(
        ...[
            (viewBox.maxX - viewBox.minX) / (extrems2.maxX - extrems2.minX),
            (viewBox.maxY - viewBox.minY) / (extrems2.maxY - extrems2.minY),
            1,
        ]
    );

    const { scaleX: scaleX2, scaleY: scaleY2, ...resultCoords } = gRoot.layerTransformation;

    gRoot.layerTransformation = {
        scaleX: scaleX2 * changeScale,
        scaleY: scaleY2 * changeScale,
        ...resultCoords
    }

    // adoption 3: repose if necessary //////////////////////////////////////////////////////////

    const extrems3 = getMinMaxCoordinates(gRoot);

    let dx = Math.max(viewBox.minX - extrems3.minX, 0);
    let dy = Math.max(viewBox.minY - extrems3.minY, 0);

    dx = Math.min(viewBox.maxX - extrems3.maxX, dx);
    dy = Math.min(viewBox.maxY - extrems3.maxY, dy);

    const { x: resultX3, y: resultY3, ...scales3 } = gRoot.layerTransformation;

    gRoot.layerTransformation = { x: resultX3 + dx, y: resultY3 + dy, ...scales3 };
}



export default autoAdaptTransformation;