import GAbstractValue from "./expression/gExpression/GAbstractValue";

export type GTypeInParent =
    'gSummand' | 'gMinuend' | 'gSubtrahend' | 'gFactorX' | 'gFactorY' | 'gComplexFactor' | 'gSimpleFactor'
    | 'gDivident' | 'gDivisor' | 'gComplexDivident' | 'gSimpleDivisor' | 'gTerm1' | 'gTerm2' | 'gTerm'
    | 'mValue' | 'mSimpleValue';
export type MTypeInParent = 'mSummand' | 'mMinuend' | 'mSubtrahend' | 'mFactor' | 'mDivident' | 'mDivisor' | 'mTerm1' | 'mTerm2' | 'mTerm';
export type TypeInParent = GTypeInParent | MTypeInParent
export type XDirection = 'left' | 'right'
export type YDirection = 'top' | 'bottom';
export type Direction = XDirection | YDirection
export const ALL_XDIRECTIONS = ['left', 'right'] as XDirection[];
export const ALL_YDIRECTIONS = ['top', 'bottom'] as YDirection[];
export const ALL_DIRECTIONS = [...ALL_XDIRECTIONS, ...ALL_YDIRECTIONS] as Direction[];
export type XY = 'X' | 'Y';
export type Operator = '+' | '-' | '*' | '/' | '=';

export type Transformation = { x: number, y: number, scaleX: number, scaleY: number }
export const DEFAULT_TRANSFORMATION = { x: 0, y: 0, scaleX: 1, scaleY: 1 };
export type ID = number;
export type CommonEdgeValue = { gValue: GAbstractValue, direction: Direction }
export type GappedNeighbour = CommonEdgeValue & { edgeDirection: Direction }

export type GappedNeighbours = {
    top: CommonEdgeValue[];
    right: CommonEdgeValue[];
    bottom: CommonEdgeValue[];
    left: CommonEdgeValue[];
}

export type ModificationType = "swapSummands" | "swapFactors2D" | "swapFactors1D" | "distribute" | "reverseDistribute"
    | "reverse" | "rotate" | "substitute" | "swap1DAnd2D" | "swapXToY"
    | "moveSummand" | "moveSubtrahend" | "moveFactor" | "moveDivisor";

export type CreationState = 'success' | 'invalid' | 'undrawable';