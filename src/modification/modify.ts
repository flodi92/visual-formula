import { autoAdaptEdges, autoAdaptTransformation, autoConfigSize, keepPositionForTransformation } from "../autoAdapt";
import { CONTAINER_PADDING } from "../draw/config";
import { GAbstractRoot } from "../expression/gExpression";
import { setUnsetIDs } from "../utils/expression";
import Modification from "./Modification";
import { MoveDivisor, MoveFactor, MoveSubtrahend, MoveSummand, moveDivisor, moveFactor, moveSubtrahend, moveSummand } from "./modifyEquation";
import { Distribute, ReverseDistribute, SwapFactors1D, SwapFactors2D, SwapSummands, distribute, reverseDistribute, swapFactors1D, swapFactors2D, swapSummands } from "./modifyTerm";
import { Reverse, Rotate, Substitute, Swap1DAnd2D, SwapXToY, reverse, rotate, substitute, swap1DAnd2D, swapXToY } from "./reconfigTerm";

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

    if ([
        "swapSummands",
        "swapFactors2D",
        "swapFactors1D",
        "distribute",
        "reverseDistribute",
        "reverse",
        "rotate",
        "substitute",
        "swap1DAnd2D",
        "swapXToY",
    ].some(val => val === modification.type)) {
        autoAdaptEdges(gRoot);
    }

    return true;
}

export default modify;