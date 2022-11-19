import { ID, TypeInParent } from "../types";

export default abstract class Expression {
    private _id?: ID;
    private _parent?: Expression;
    private _typeInParent?: TypeInParent;

    private _childrenMap = new Map<TypeInParent, Expression | undefined>();
    private _childrenArray = new Array<Expression>();

    public get id() { return this._id }
    public set id(val) { this._id = val }

    protected getChild(typeInParent: TypeInParent) {
        return this._childrenMap.get(typeInParent);
    }

    protected setChild(typeInParent: TypeInParent, child?: Expression,) {
        child && child._setParent(this, typeInParent);
        this._childrenMap.set(typeInParent, child);
    }

    protected setChildren(children: Expression[] = [], typeInParent: TypeInParent) {
        children.forEach((child) => child._setParent(this, typeInParent));
        this._childrenArray = children;
    }

    protected abstract childrenTypesInParentDefinition(): TypeInParent[] | TypeInParent;

    private isChildrenMap() { return Array.isArray(this.childrenTypesInParentDefinition()) }

    public get children(): (Expression | undefined)[] {
        return this.isChildrenMap() ?
            (this.childrenTypesInParentDefinition() as TypeInParent[]).map(typeInParent => this._childrenMap.get(typeInParent))
            : this._childrenArray;
    }

    public get childrenTypesInParent(): TypeInParent[] {
        return this.isChildrenMap() ?
            this.childrenTypesInParentDefinition() as TypeInParent[]
            : this._childrenArray.map(() => this.childrenTypesInParentDefinition() as TypeInParent)
    }

    // normaly invoked internaly, but needed for clone
    public _setParent(parent?: Expression, typeInParent?: TypeInParent) {
        [this._parent, this._typeInParent] = [parent, typeInParent];
    }

    public get parent() {
        return this._parent;
    }

    public get typeInParent() {
        return this._typeInParent;
    }
}