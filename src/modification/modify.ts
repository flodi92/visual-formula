import { GAbstractRoot } from "../expression/gExpression";
import Modification from "./Modification";
import { MoveDivisor, moveDivisor, moveFactor, MoveFactor, moveSubtrahend, MoveSubtrahend, MoveSummand, moveSummand } from "./modifyEquation";
import { distribute, Distribute, reverseDistribute, ReverseDistribute, swapFactors1D, SwapFactors1D, swapFactors2D, SwapFactors2D, SwapSummands, swapSummands } from "./modifyTerm";
import { reverse, Reverse, rotate, Rotate, substitute, Substitute, swap1DAnd2D, Swap1DAnd2D, swapXToY, SwapXToY } from "./reconfigTerm";

const modify = (expression: GAbstractRoot, modification: Modification): boolean => {
    switch (modification.type) {
        case "swapSummands":
            return swapSummands(expression, modification as SwapSummands);
        case "swapFactors2D":
            return swapFactors2D(expression, modification as SwapFactors2D);
        case "swapFactors1D":
            return swapFactors1D(expression, modification as SwapFactors1D);
        case "distribute":
            return distribute(expression, modification as Distribute);
        case "reverseDistribute":
            return reverseDistribute(expression, modification as ReverseDistribute);

        case "reverse":
            return reverse(expression, modification as Reverse);
        case "rotate":
            return rotate(expression, modification as Rotate);
        case "substitute":
            return substitute(expression, modification as Substitute);
        case "swap1DAnd2D":
            return swap1DAnd2D(expression, modification as Swap1DAnd2D);
        case "swapXToY":
            return swapXToY(expression, modification as SwapXToY);

        case "moveSummand":
            return moveSummand(expression, modification as MoveSummand);
        case "moveSubtrahend":
            return moveSubtrahend(expression, modification as MoveSubtrahend);
        case "moveFactor":
            return moveFactor(expression, modification as MoveFactor);
        case "moveDivisor":
            return moveDivisor(expression, modification as MoveDivisor);

        default:
            return false;
    }

}

export default modify;