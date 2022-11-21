import Expression from "../expression/Expression";
import { GAbstractRoot, GExpression } from "../expression/gExpression";
import { MExpression } from "../expression/mExpression";
import Modification from "../modification/Modification";
import { ID } from "../types";
import CreationManager from "./CreationManager";
import HistoryManager, { ModificationResult } from "./HistoryManager";

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
