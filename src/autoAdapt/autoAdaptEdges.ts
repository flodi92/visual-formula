import GAbstractRoot from "../expression/gExpression/GAbstractRoot";
import GSimpleValue from "../expression/gExpression/GSimpleValue";
import GValue from "../expression/gExpression/GValue";
import { ALL_XDIRECTIONS, ALL_YDIRECTIONS, Direction, ID, XDirection, YDirection } from "../types";
import autoAdapt, { Configuration, AutoAdaption } from "./autoAdapt";
import GExpression from "../expression/gExpression/GExpression";
import { find } from "../utils/expression";
import { getGAbstractValueIds, isEdgePossible } from "../utils/gExpression";
import { oppositeDirection } from "../utils/general";

class EdgeConfiguration extends Configuration {
    private _xEdge: XDirection;
    private _yEdge: YDirection;
    private _edge: Direction;

    public get xEdge(): XDirection {
        return this._xEdge;
    }
    public set xEdge(value: XDirection) {
        this._xEdge = value;
    }
    public get yEdge(): YDirection {
        return this._yEdge;
    }
    public set yEdge(value: YDirection) {
        this._yEdge = value;
    }
    public get edge(): Direction {
        return this._edge;
    }
    public set edge(value: Direction) {
        this._edge = value;
    }
}

class AutoEdgeAdaption implements AutoAdaption<EdgeConfiguration> {
    private _root: GAbstractRoot;
    public get root(): GAbstractRoot {
        return this._root;
    }
    public set root(value: GAbstractRoot) {
        this._root = value;
    }
    getAdaptedIds(): ID[] {
        return getGAbstractValueIds(this.root);
    }
    getPossibleConfigurations(id: ID) {
        let buffer: EdgeConfiguration[] = []

        const expression = find(id, this._root);
        if (!expression) return [];

        const possibleXdirections = ALL_XDIRECTIONS.filter((direction) =>
            isEdgePossible(expression, direction)
        );

        const possibleYdirections = ALL_YDIRECTIONS.filter((direction) =>
            isEdgePossible(expression, direction)
        );


        if (expression instanceof GValue) {
            possibleXdirections.forEach(xEdge =>
                possibleYdirections.forEach(yEdge => {
                    const config = new EdgeConfiguration();
                    config.badPreference = 1; // TODO
                    config.id = id;
                    config.xEdge = xEdge;
                    config.yEdge = yEdge;
                    buffer.push(config)
                }
                )
            )

        } else if (expression instanceof GSimpleValue) {
            [...possibleXdirections, ...possibleYdirections].forEach(edge => {
                const config = new EdgeConfiguration();
                config.badPreference = 1; // TODO
                config.id = id;
                config.edge = edge;
                buffer.push(config)
            }
            )
        }

        return buffer;
    }
    applyConfiguration(configuration: EdgeConfiguration) {
        const expression = find(configuration.id, this._root) as GExpression;
        if (!expression) return null;

        if (expression instanceof GValue) {
            // TODO
            // expression.xEdge = configuration.xEdge;
            // expression.yEdge = configuration.yEdge;
        }
        else if (expression instanceof GSimpleValue) {
            expression.edge = configuration.edge;
        }
    };
    applyConfigurations(configurations: EdgeConfiguration[]) {
        configurations.map(configuration => this.applyConfiguration(configuration));
    };
    resetConfiguration(configuration: EdgeConfiguration) {
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
    resetConfigurations(configurations: EdgeConfiguration[]) {
        configurations.map(configuration => this.resetConfiguration(configuration));
    };
}

export default function autoAdaptEdges(root: GAbstractRoot) {
    return autoAdapt<AutoEdgeAdaption>(root, new AutoEdgeAdaption())
}


