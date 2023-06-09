import { cloneExpression } from "../conversion";
import Expression from "../expression/Expression";
import {
    GAbstractDirectedExpression, GAbstractValue, GExpression, GProduct1D, GProduct2D, GQuotient1D, GQuotient2D, GSimpleValue, GValue
} from "../expression/gExpression";
import { Direction, ID, XDirection, YDirection } from "../types";
import { expressionToArray, find } from "../utils/expression";
import { directionToXY, oppositeDirection } from "../utils/general";
import { getGSimpleValues, getGValues } from "../utils/gExpression";
import getPossibleEdges from "../utils/gExpression/getPossibleEdges";
import autoAdapt, { AutoAdaption, Configuration } from "./autoAdapt";

abstract class EdgesConfiguration extends Configuration { }

class OneEdgeConfiguration extends EdgesConfiguration {
    public constructor(id: ID, badPreference: number,
        public readonly edge: Direction) {
        super(id, badPreference);
    }

}
class TwoEdgesConfiguration extends EdgesConfiguration {
    public constructor(id: ID, badPreference: number,
        public readonly xEdge: YDirection,
        public readonly yEdge: XDirection) {
        super(id, badPreference);
    }
}

class AutoEdgeAdaption implements AutoAdaption<EdgesConfiguration> {
    private _root?: GExpression;
    private _referenceRoot?: GExpression;

    public get root(): GExpression | undefined {
        return this._root;
    }
    public set root(value: GExpression | undefined) {
        this._root = value;

        if (!value) return;
        this._referenceRoot = cloneExpression(value, { isAdoptIDs: true }) as GExpression;
    }
    getAdaptedIds(): ID[] {
        return this.root ? ([...getGValues(this.root), ...getGSimpleValues(this.root)]
            .map(expression => expression.id))
            .filter(id => id !== undefined) as ID[]
            : [];
    }
    getPossibleConfigurations(id: ID) {
        let buffer: EdgesConfiguration[] = []
        if (!this._root) return []

        const expression = find(id, this._root);
        if (!expression || !(expression instanceof GAbstractValue)) return [];

        const possibleEdges = getPossibleEdges(expression);

        const possibleXdirections = possibleEdges.filter(edge => directionToXY(edge) === 'X') as XDirection[];
        const possibleYdirections = possibleEdges.filter(edge => directionToXY(edge) === 'Y') as YDirection[];


        if (expression instanceof GValue) {
            possibleYdirections.forEach(xEdge =>
                possibleXdirections.forEach(yEdge => {
                    const badPreference = this.getGValueBadPreference(expression, xEdge, yEdge);
                    const config = new TwoEdgesConfiguration(id, badPreference, xEdge, yEdge);
                    buffer.push(config)
                }
                )
            )

        } else if (expression instanceof GSimpleValue
            && expression.parent instanceof GAbstractDirectedExpression) {

            const possibleDirections = directionToXY(expression.parent.startDirection) === "X" ?
                possibleYdirections : possibleXdirections;

            possibleDirections.forEach(edge => {
                const badPreference = this.getGSimpleValueBadPreference(expression, edge);
                const config = new OneEdgeConfiguration(id, badPreference, edge);
                buffer.push(config)
            }
            )
        }

        return buffer;
    }
    applyConfiguration(configuration: EdgesConfiguration) {
        if (!this._root) return;

        const expression = find(configuration.id, this._root) as GExpression;
        if (!expression) return null;

        if (expression instanceof GValue && configuration instanceof TwoEdgesConfiguration) {
            expression.xEdge = configuration.xEdge;
            expression.yEdge = configuration.yEdge;
        }
        else if (expression instanceof GSimpleValue && configuration instanceof OneEdgeConfiguration) {
            expression.edge = configuration.edge;
        }
    };
    applyConfigurations(configurations: EdgesConfiguration[]) {
        configurations.forEach(configuration => this.applyConfiguration(configuration));
    };
    resetAll() {
        if (!this._root) return;

        expressionToArray(this._root).forEach(
            expression => resetEdges(expression)
        );
    }
    resetConfiguration(configuration: EdgesConfiguration) {
        if (!this._root) return;

        const expression = find(configuration.id, this._root) as GExpression;
        resetEdges(expression);
    };
    resetConfigurations(configurations: EdgesConfiguration[]) {
        configurations.map(configuration => this.resetConfiguration(configuration));
    };

    private getGSimpleValueBadPreference(expression: GSimpleValue, edge: Direction) {
        const { parent } = expression;
        const complexValue = (parent instanceof GProduct1D) ? parent.gComplexFactor : (parent instanceof GQuotient1D) ? parent.gComplexDivident : undefined;

        return (complexValue instanceof GValue && (complexValue.xEdge === edge || complexValue.yEdge === edge)) ? 2 : 3;
    }

    private getGValueBadPreference(expression: GValue, xEdge: YDirection, yEdge: XDirection) {
        const { parent, id } = expression;

        const reference = ((id !== undefined && !!this._referenceRoot)
            ? find(id, this._referenceRoot) : undefined) as GValue | undefined;

        const [_xEdge, _yEdge] = [reference?.xEdge, reference?.yEdge];

        if (!!_xEdge && !!_yEdge && xEdge === _xEdge && yEdge === _yEdge) {
            return 0;
        }

        let isEdgeToInside = false;

        if (parent instanceof GProduct2D && !!parent.yEdge && !!parent.xEdge) {
            isEdgeToInside =
                (expression.typeInParent === "gFactorX" && xEdge === oppositeDirection(parent.xEdge))
                ||
                (expression.typeInParent === "gFactorY" && yEdge === oppositeDirection(parent.yEdge))
                ;
        } else if (parent instanceof GQuotient2D && expression.typeInParent === "gDivisor") {
            isEdgeToInside =
                (directionToXY(parent.divisorEdge) === 'X' && xEdge === oppositeDirection(parent.divisorEdge))
                ||
                (directionToXY(parent.divisorEdge) === 'Y' && yEdge === oppositeDirection(parent.divisorEdge))
                ;
        }

        return isEdgeToInside ? 2 : 3;
    }
}

const resetEdges = (expression: Expression) => {
    if (!expression) return;

    if (expression instanceof GValue) {
        expression.xEdge = undefined;
        expression.yEdge = undefined;
    } else if (expression instanceof GSimpleValue) {
        expression.edge = undefined;
    }
}

export default function autoAdaptEdges(root: GExpression) {
    return autoAdapt<AutoEdgeAdaption>(root, new AutoEdgeAdaption())
}


