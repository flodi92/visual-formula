import autoAdaptEdges from "../autoAdapt/autoAdaptEdges";
import { autoConfigSize } from "../autoAdapt/autoConfigSize";
import { getExpressionFromJSON } from "../conversion";
import Expression from "../expression/Expression";
import { GAbstractRoot, GExpression } from "../expression/gExpression";
import { MExpression } from "../expression/mExpression";
import Modification from "../modification/Modification";
import { ID } from "../types";



interface ModificationResult { expression: Expression, modification?: Modification }

export default class ExpressionManager {
    private readonly history = new HistoryManager();
    private readonly creator = new CreationManager();

    // TODO auto positioning

    public init() {
        this.creator.expression && this.history.init(this.creator.expression)
    }

    // creator delegates
    public get json() { return this.creator.json }
    public set json(value: object | string | undefined) { this.creator.json = value }

    public get formulaString() { return this.creator.formulaString }
    public set formulaString(value: string | undefined) { this.creator.formulaString = value }

    public get mExpression() { return this.creator.mExpression }
    public set mExpression(value: MExpression | undefined) { this.creator.mExpression = value }

    public get expression() { return this.creator.expression }
    public get creationState() { return this.creator.creationState }


    // history delegates
    public get possibleModifications() { return this.history.possibleModifications }

    public get currentResult() { return this.history.currentResult }

    public get currentExpression() { return this.history.currentExpression }

    public get currentModification() { return this.history.currentModification }

    public get selectedID() { return this.history.selectedID }
    public set selectedID(value: ID) { this.history.selectedID = value }

    public pushHistory(modificationResult: ModificationResult) { this.history.pushHistory(modificationResult) }
    public backward() { this.history.backward() }
    public forward() { this.history.forward() }
}

type CreationState = 'success' | 'invalid' | 'undrawable';

class CreationManager {

    private _json?: object | string;
    private _formulaString?: string;
    private _mExpression?: MExpression;

    private _expression?: Expression;
    private _creationState?: CreationState | undefined; // TODO


    public get json(): object | string | undefined {
        return this._json;
    }
    public set json(value: object | string | undefined) {
        this._json = value;
        if (!!value) this._expression = CreationManager.fromJSON(value);
    }

    public get formulaString(): string | undefined {
        return this._formulaString;
    }
    public set formulaString(value: string | undefined) {
        this._formulaString = value;
        if (!!value) this._expression = CreationManager.fromFormulaString(value);
    }

    public get mExpression(): MExpression | undefined {
        return this._mExpression;
    }
    public set mExpression(value: MExpression | undefined) {
        this._mExpression = value;
        if (!!value) this._expression = CreationManager.fromMExpression(value);
    }

    public get expression(): Expression | undefined {
        return this._expression;
    }

    public get creationState(): CreationState | undefined {
        return this._creationState;
    }

    static consolidateGExpression(gExpression: GAbstractRoot) {
        let valid = true;
        valid = valid && addNumericValues(gExpression);
        // valid = valid && autoConfigSize(gExpression); // TODO autoConfigSize returns success value
        autoConfigSize(gExpression);
        // valid = valid && autoAdaptEdges(gExpression); // TODO autoAdaptEdges returns success value
        autoAdaptEdges(gExpression);
        return valid;
    }

    static fromJSON(expression: object | string) {
        const buffer = getExpressionFromJSON(expression);
        if (buffer instanceof GAbstractRoot) {
            const success = CreationManager.consolidateGExpression(buffer);
            if (!success) return undefined;
        }

        return buffer;
    }

    static fromFormulaString(formulaString: string): GAbstractRoot | undefined {
        const mExpression = getExpressionFromJSON(formulaString) as MExpression;
        return CreationManager.fromMExpression(mExpression);
    }

    static fromMExpression(mExpression: MExpression): GAbstractRoot | undefined {
        const buffer = autoAdapt1D2DM(mExpression);
        if (buffer instanceof GAbstractRoot) {
            const success = CreationManager.consolidateGExpression(buffer);
            if (!success) return undefined;
        }

        return buffer;
    }
}

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

const getPossibleModifications = (expression: Expression, id: ID) => {
    throw new Error("Not implemented");
}

const modify = (expression: Expression, modification: Modification): boolean => {
    // expression = expression.copy();
    // consolidate position
    throw new Error("Not implemented");
}

const addNumericValues = (gExpression: GExpression): boolean => {
    throw new Error("Not implemented");
}

const autoAdapt1D2DM = (mExpression: MExpression): GAbstractRoot => {
    throw new Error("Not implemented");
}