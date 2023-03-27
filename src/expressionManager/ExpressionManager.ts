import { autoAdaptEdges, autoAdaptTransformation, autoConfigSize } from "../autoAdapt";
import { getExpressionFromJSON } from "../conversion";
import { CONTAINER_PADDING } from "../draw/config";
import { GAbstractRoot } from "../expression/gExpression";
import Modification from "../modification/Modification";
import modify from "../modification/modify";

export default class ExpressionManager {
    private _getBox: () => { width: number; height: number; } = () => ({ width: 100, height: 100 });

    private history: GAbstractRoot[] = [];
    private historyI: number = 0;

    public modify(...modifications: Modification[]) {
        for (let idx = 0; idx < modifications.length; idx++) {
            const buffer = this.root?.clone({ isAdoptIDs: true });
            const success = !!buffer ? modify(buffer, modifications[idx], this.getBox()) : false;
            if (success && !!buffer) { this.pushHistory(buffer); }
            if (!success) { return false; }
        }

        return true;
    }

    public forward() {
        this.historyI = Math.min(this.historyI + 1, this.history.length - 1);
    }

    public backward() {
        this.historyI = Math.max(this.historyI - 1, 0);
    }

    private pushHistory(root: GAbstractRoot) {
        this.historyI++;
        this.history = this.history.slice(0, this.historyI);
        this.history.push(root);
    }

    public get root(): GAbstractRoot | undefined {
        return this.history[this.historyI];
    }

    public init(value: GAbstractRoot | undefined) {
        value && this.pushHistory(value);
        this.history = !!value ? [value] : [];
        this.historyI = 0
    }

    public initFromJSON(json: object, scale: number) {
        const root = getExpressionFromJSON(json) as GAbstractRoot;
        if (!root) return;

        root.layerTransformation = { scaleX: scale, scaleY: scale, x: 0, y: 0 }

        autoConfigSize(root);

        autoAdaptTransformation({ gRoot: root, padding: CONTAINER_PADDING, ...this.getBox() })
        autoAdaptEdges(root);

        this.init(root);
    }

    public get getBox(): () => { width: number; height: number; } {
        return this._getBox;
    }
    public set getBox(value: () => { width: number; height: number; }) {
        this._getBox = value;
    }
}

/// TODO what is still needed

// export default class ExpressionManager {
//     private readonly history = new HistoryManager();
//     private readonly creator = new CreationManager();

//     // TODO auto positioning

//     public init() {
//         this.creator.expression && this.history.init(this.creator.expression)
//     }

//     // creator delegates
//     public get json() { return this.creator.json }
//     public set json(value: object | string | undefined) { this.creator.json = value }

//     public get formulaString() { return this.creator.formulaString }
//     public set formulaString(value: string | undefined) { this.creator.formulaString = value }

//     public get mExpression() { return this.creator.mExpression }
//     public set mExpression(value: MExpression | undefined) { this.creator.mExpression = value }

//     public get expression() { return this.creator.expression }
//     public get creationState() { return this.creator.creationState }


//     // history delegates
//     public get possibleModifications() { return this.history.possibleModifications }

//     public get currentResult() { return this.history.currentResult }

//     public get currentExpression() { return this.history.currentExpression }

//     public get currentModification() { return this.history.currentModification }

//     public get selectedID() { return this.history.selectedID }
//     public set selectedID(value: ID) { this.history.selectedID = value }

//     public pushHistory(modificationResult: ModificationResult) { this.history.pushHistory(modificationResult) }
//     public backward() { this.history.backward() }
//     public forward() { this.history.forward() }
// }
