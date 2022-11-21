import GAbstractRoot from "../expression/gExpression/GAbstractRoot";
import GSimpleValue from "../expression/gExpression/GSimpleValue";
import GValue from "../expression/gExpression/GValue";
import { ALL_XDIRECTIONS, ALL_YDIRECTIONS, Direction, ID, XDirection, YDirection } from "../types";
import autoAdapt, { Configuration, AutoAdaption } from "./autoAdapt";
import GExpression from "../expression/gExpression/GExpression";
import { find } from "../utils/expression";
import { getGAbstractValueIds, isEdgePossible } from "../utils/gExpression";

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
                    const badPreference = 1; // TODO
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

        if (expression instanceof GValue) {
            // TODO
            // expression.xEdge = configuration.xEdge;
            // expression.yEdge = configuration.yEdge;
        }
        else if (expression instanceof GSimpleValue) {
            expression.edge = (configuration as OneEdgeConfiguration).edge;
        }
    };
    applyConfigurations(configurations: EdgesConfiguration[]) {
        configurations.map(configuration => this.applyConfiguration(configuration));
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
}

export default function autoAdaptEdges(root: GAbstractRoot) {
    return autoAdapt<AutoEdgeAdaption>(root, new AutoEdgeAdaption())
}


