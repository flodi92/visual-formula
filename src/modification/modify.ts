import { autoAdaptEdges, autoAdaptTransformation, autoConfigSize, keepPositionForTransformation } from "../autoAdapt";
import { CONTAINER_PADDING } from "../draw/config";
import { GAbstractRoot } from "../expression/gExpression";
import { find, setUnsetIDs } from "../utils/expression";
import { removeEdges } from "../utils/gExpression";
import Modification from "./Modification";
import { MoveDivisor, moveDivisor, moveFactor, MoveFactor, moveSubtrahend, MoveSubtrahend, MoveSummand, moveSummand } from "./modifyEquation";
import { distribute, Distribute, reverseDistribute, ReverseDistribute, swapFactors1D, SwapFactors1D, swapFactors2D, SwapFactors2D, SwapSummands, swapSummands } from "./modifyTerm";
import { reverse, Reverse, rotate, Rotate, substitute, Substitute, swap1DAnd2D, Swap1DAnd2D, swapXToY, SwapXToY } from "./reconfigTerm";

const modify = (gRoot: GAbstractRoot, modification: Modification, box: { width: number, height: number }): boolean => {

    const positionForTransformation
        = keepPositionForTransformation({ gRoot, modifiedID: modification.id });

    let buffer = false;

    switch (modification.type) {
        case "swapSummands":
            buffer = swapSummands(gRoot, modification as SwapSummands); break;
        case "swapFactors2D":
            buffer = swapFactors2D(gRoot, modification as SwapFactors2D); break;
        case "swapFactors1D":
            buffer = swapFactors1D(gRoot, modification as SwapFactors1D); break;
        case "distribute":
            buffer = distribute(gRoot, modification as Distribute); break;
        case "reverseDistribute":
            buffer = reverseDistribute(gRoot, modification as ReverseDistribute); break;

        case "reverse":
            buffer = reverse(gRoot, modification as Reverse); break;
        case "rotate":
            buffer = rotate(gRoot, modification as Rotate); break;
        case "substitute":
            buffer = substitute(gRoot, modification as Substitute); break;
        case "swap1DAnd2D":
            buffer = swap1DAnd2D(gRoot, modification as Swap1DAnd2D); break;
        case "swapXToY":
            buffer = swapXToY(gRoot, modification as SwapXToY); break;

        case "moveSummand":
            buffer = moveSummand(gRoot, modification as MoveSummand); break;
        case "moveSubtrahend":
            buffer = moveSubtrahend(gRoot, modification as MoveSubtrahend); break;
        case "moveFactor":
            buffer = moveFactor(gRoot, modification as MoveFactor); break;
        case "moveDivisor":
            buffer = moveDivisor(gRoot, modification as MoveDivisor); break;
    }

    if (!buffer) return false;

    setUnsetIDs(gRoot);

    if (["swap1DAnd2D"].some(val => val === modification.type)) {
        autoConfigSize(gRoot);
    }

    autoAdaptTransformation({ gRoot, modifiedID: modification.id, ...box, padding: CONTAINER_PADDING }, positionForTransformation);

    if (['substitute', 'swap1DAnd2D', 'swapXToY', 'distribute'].some(val => val === modification.type)) {
        const child = find(modification.id, gRoot);
        removeEdges(child);
        autoAdaptEdges(gRoot);
    }

    return true;
}

export default modify;