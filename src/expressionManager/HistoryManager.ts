import Expression from "../expression/Expression";
import getPossibleModifications from "../modification/getPossibleModifications";
import Modification from "../modification/Modification";
import { ID } from "../types";

export interface ModificationResult { expression: Expression, modification?: Modification }

class HistoryManager {
    private _history: ModificationResult[] = [];
    private _possibleModifications: ModificationResult[] = [];
    private _idx: number = -1;
    private _selectedID: ID = -1;

    public get possibleModifications(): ModificationResult[] {
        return this._possibleModifications;
    }

    public get currentResult(): ModificationResult | undefined {
        return this._history.length !== 0 && this._idx > 0 ? this._history[this._idx] : undefined;
    }

    public get currentExpression() {
        return this.currentResult?.expression;
    }

    public get currentModification() {
        return this.currentResult?.modification;
    }

    public get selectedID(): ID {
        return this._selectedID;
    }
    public set selectedID(value: ID) {
        this._selectedID = value;
        this.updateModifications();
    }

    public init(expression: Expression) {
        this._idx = -1;
        this.pushHistory({ expression })
    }

    public pushHistory(modificationResult: ModificationResult) {
        this._idx++;
        this._history = this._history.slice(0, this._idx);
        this._history.push(modificationResult);
        this.updateModifications();
    }

    private updateModifications() {
        if (!this.currentExpression) return;
        this._possibleModifications = getPossibleModifications(this.currentExpression, this.selectedID)
    }

    public backward() {
        this._idx = Math.max(this._idx - 1, 0);
        this.updateModifications();
    }

    public forward() {
        this._idx = Math.min(this._idx + 1, this._history.length - 1);
        this.updateModifications();
    }

}

export default HistoryManager;