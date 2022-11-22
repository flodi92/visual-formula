import GAbstractRoot from "../expression/gExpression/GAbstractRoot";
import GSimpleValue from "../expression/gExpression/GSimpleValue";
import GValue from "../expression/gExpression/GValue";
import { ALL_XDIRECTIONS, ALL_YDIRECTIONS, Direction, ID, XDirection, YDirection } from "../types";
import autoAdapt, { Configuration, AutoAdaption } from "./autoAdapt";
import GExpression from "../expression/gExpression/GExpression";
import { find } from "../utils/expression";
import { getGAbstractValueIds, isEdgePossible } from "../utils/gExpression";
import { GAbstractDirectedExpression, GProduct1D, GProduct2D, GSum } from "../expression/gExpression";
import { directionsToNumber, directionToNumber, oppositeDirection } from "../utils/general";

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
    private _root?: GAbstractRoot;
    public get root(): GAbstractRoot | undefined {
        return this._root;
    }
    public set root(value: GAbstractRoot | undefined) {
        this._root = value;
    }
    getAdaptedIds(): ID[] {
        return this.root ? getGAbstractValueIds(this.root) : [];
    }
    getPossibleConfigurations(id: ID) {
        let buffer: EdgesConfiguration[] = []
        if (!this._root) return []

        const expression = find(id, this._root);
        if (!expression) return [];

        const possibleXdirections = ALL_XDIRECTIONS.filter((direction) =>
            isEdgePossible(expression, direction)
        );

        const possibleYdirections = ALL_YDIRECTIONS.filter((direction) =>
            isEdgePossible(expression, direction)
        );


        if (expression instanceof GValue) {
            possibleYdirections.forEach(xEdge =>
                possibleXdirections.forEach(yEdge => {
                    const badPreference = this.getGValueBadPreference(expression, xEdge, yEdge);
                    const config = new TwoEdgesConfiguration(id, badPreference, xEdge, yEdge);
                    buffer.push(config)
                }
                )
            )

        } else if (expression instanceof GSimpleValue) {
            [...possibleXdirections, ...possibleYdirections].forEach(edge => {
                const badPreference = 1; // TODO
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
    resetConfiguration(configuration: EdgesConfiguration) {
        if (!this._root) return;

        const expression = find(configuration.id, this._root) as GExpression;
        if (!expression) return null;

        if (expression instanceof GValue) {
            expression.xEdge = undefined;
            expression.yEdge = undefined;
        }
        else if (expression instanceof GSimpleValue) {
            expression.edge = undefined;
        }
    };
    resetConfigurations(configurations: EdgesConfiguration[]) {
        configurations.map(configuration => this.resetConfiguration(configuration));
    };

    private getGValueBadPreference(expression: GValue, xEdge: YDirection, yEdge: XDirection) {

        const parent = expression.parent;
        // TODO badPreference by prefering same config as former value

        if (parent instanceof GAbstractDirectedExpression
            && !!parent.startDirection) {

            // assure same badPreferences if relative constelation is the same

            const startDirectionNumber = <number>directionToNumber(parent.startDirection);
            const edgesNumber = <number>directionsToNumber(yEdge, xEdge);

            return Math.abs(startDirectionNumber - edgesNumber) + Math.sign(startDirectionNumber - edgesNumber) * 0.25;
        } else if (parent instanceof GProduct2D
            && !!parent.gFactorX && !!parent.gFactorY) {

            const isEdgeToInside =
                (expression.typeInParent === "gFactorX" && yEdge === oppositeDirection(parent.yEdge))
                ||
                (expression.typeInParent === "gFactorY" && xEdge === oppositeDirection(parent.xEdge))
                ;

            const productEdgesNumber = <number>directionsToNumber(parent.yEdge, parent.xEdge);
            const edgesNumber = <number>directionsToNumber(yEdge, xEdge);

            const discriminationValue = Math.abs(productEdgesNumber - edgesNumber) + Math.sign(productEdgesNumber - edgesNumber) * 0.25;

            return discriminationValue + (isEdgeToInside ? 0 : 5);
        }

        return 2;
    }
}

export default function autoAdaptEdges(root: GAbstractRoot) {
    return autoAdapt<AutoEdgeAdaption>(root, new AutoEdgeAdaption())
}


