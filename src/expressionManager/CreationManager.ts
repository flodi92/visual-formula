import {
    autoAdapt1D2DM,
    autoAdaptEdges,
    autoAdaptNumericValues,
    autoConfigSize,
} from "../autoAdapt"

import { getExpressionFromJSON } from "../conversion";
import Expression from "../expression/Expression";
import { GAbstractRoot } from "../expression/gExpression";
import { MExpression } from "../expression/mExpression";
import { CreationState } from "../types";

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
        valid = valid && autoAdaptNumericValues(gExpression);
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

export default CreationManager;