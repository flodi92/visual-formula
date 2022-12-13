import { cloneExpression } from "../../conversion";
import { GAbstractRoot, GDifference, GExpression, GProduct1D, GProduct2D, GQuotient1D, GQuotient2D, GSum } from "../../expression/gExpression";
import { ID, XY } from "../../types";
import { compareExpressions, find, replace } from "../../utils/expression";
import { getSubtrahends, getSummands, setSubtrahends, setSummands } from "../../utils/gExpression";

export const reverseDistribute = ({ expression, id, xy }
  : { expression: GAbstractRoot, id: ID, xy: XY }) => {
  if ([expression, id, xy].some((val) => val == null)) return false;

  const parent = find(id, expression);

  if (!(parent instanceof GSum) && !(parent instanceof GDifference)) return false;

  const summands = getSummands(parent);
  const subtrahends = getSubtrahends(parent);
  const children = [...summands, ...subtrahends];

  let associateds: (GExpression | undefined)[];
  let associateInSummands: (GExpression | undefined)[];
  let associateInSubtrahends: (GExpression | undefined)[];
  let _getNewParent: (associated: GExpression, complex: GExpression) => GExpression;

  if (!children.length) return false;

  //GProduct1D
  if (
    children.every(
      (c) =>
        c instanceof GProduct1D &&
        children[0] instanceof GProduct1D &&
        c.startDirection === children[0].startDirection
    )
  ) {
    associateds = (<GProduct1D[]>children).map((c) => c.gSimpleFactor);
    associateInSummands = (<GProduct1D[]>summands).map((c) => c.gComplexFactor);
    associateInSubtrahends = (<GProduct1D[]>subtrahends).map((c) => c.gComplexFactor);
    _getNewParent = (associated: GExpression, complex: GExpression) =>
      new GProduct1D({
        gComplexFactor: complex,
        gSimpleFactor: associated,
        startDirection: (<GProduct1D>children[0]).startDirection,
      });
  }
  //GProduct2D
  else if (children.every((c) => c instanceof GProduct2D)) {
    const [associatedFactor, associateInFactor] =
      (xy === "X" ? ["gFactorY", "gFactorX"] : ["gFactorX", "gFactorY"]) as ["gFactorX" | "gFactorY", "gFactorX" | "gFactorY"];
    associateds = (<GProduct2D[]>children).map((c) => c[associatedFactor]);
    associateInSummands = (<GProduct2D[]>summands).map((c) => c[associateInFactor]);
    associateInSubtrahends = (<GProduct2D[]>subtrahends).map((c) => c[associateInFactor]);
    _getNewParent = (associated: GExpression, complex: GExpression) =>
      new GProduct2D({
        [associateInFactor]: complex,
        [associatedFactor]: cloneExpression(associated),
        xEdge: (<GProduct2D>children[0]).xEdge,
        yEdge: (<GProduct2D>children[0]).yEdge,
      });
  }
  //GQuotient1D
  else if (
    children.every(
      (c) =>
        c instanceof GQuotient1D &&
        children[0] instanceof GQuotient1D &&
        c.startDirection === children[0].startDirection
    )
  ) {
    associateds = (<GQuotient1D[]>children).map((c) => c.gSimpleDivisor);
    associateInSummands = (<GQuotient1D[]>summands).map((c) => c.gComplexDivident);
    associateInSubtrahends = (<GQuotient1D[]>subtrahends).map((c) => c.gComplexDivident);
    _getNewParent = (associated: GExpression, complex: GExpression) =>
      new GQuotient1D({
        gComplexDivident: complex,
        gSimpleDivisor: cloneExpression(associated),
        startDirection: (<GProduct1D>children[0]).startDirection,
      });
  }
  //GQuotient2D
  else if (children.every((c) => c instanceof GQuotient2D)) {
    associateds = (<GQuotient2D[]>children).map((c) => c.gDivisor);
    associateInSummands = (<GQuotient2D[]>summands).map((c) => c.gDivident);
    associateInSubtrahends = (<GQuotient2D[]>subtrahends).map((c) => c.gDivident);
    _getNewParent = (associated: GExpression, complex: GExpression) =>
      new GQuotient2D({
        gDivisor: cloneExpression(associated),
        gDivident: complex,
        divisorEdge: (<GQuotient2D>children[0]).divisorEdge,
        resultEdge: (<GQuotient2D>children[0]).resultEdge,
      });
  } else return false;

  if (
    associateds.some((child) => !compareExpressions(child, associateds[0]))
  )
    return false;

  let complex = setSummands(
    undefined,
    associateInSummands.filter(summand => !!summand) as GExpression[],
    parent.startDirection);
  if (!!associateInSubtrahends.length)
    complex = setSubtrahends(
      complex,
      associateInSubtrahends.filter(subtrahends => !!subtrahends) as GExpression[],
      parent.startDirection
    );
  const newParent = _getNewParent(<GExpression>(associateds[0]), <GExpression>complex);

  replace(id, expression, newParent);

  return true;
};