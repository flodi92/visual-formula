import { GExpression } from "../expression/gExpression";

const autoAdaptNumericValues = (gExpression: GExpression): boolean => {
    throw new Error("Not implemented");
}
// import { GAbstractRoot, GAbstractValue } from "../expression/gExpression";
// var nerdamer = require('nerdamer');
// require('nerdamer/Solve');

// import { uniq } from "lodash";
// import { getFormulaStringFromExpression } from "../conversion";
// import { MValue } from "../expression/mExpression";
// import { expressionToArray } from "../utils/expression";

// const autoAdaptNumericValues = (gAbstractRoot: GAbstractRoot): boolean => {
//     let variables = expressionToArray(gAbstractRoot)
//         .filter(expression => expression instanceof MValue && expression.isConstant)
//         .map(expression => (<MValue>expression).mValue as string);
//     variables = uniq(variables);

//     const formulaString = gAbstractRoot.formulaString;
//     if (variables.length !== 1 || !formulaString) return false;

//     const variable = variables[0];
//     let results = nerdamer.solveEquations(formulaString, variable);

//     results = getPositiveRealValues(results);

//     if (results.length === 0) return false;
//     const result = results[0];

//     let gVariables = expressionToArray(gAbstractRoot)
//         .filter(expression => expression instanceof GAbstractValue) as GAbstractValue[];

//     gVariables.forEach(
//         gVariable => {
//             const formulaString = getFormulaStringFromExpression(gVariable);
//             const numericValue = Number(
//                 nerdamer(formulaString, { [variable]: result }).evaluate().text()
//             );
//             gVariable.numericValue = numericValue;
//         }
//     );

//     return true;
// }

// const getPositiveRealValues = (results: any[]) =>
//     results.map(result => result.toString() as string)
//         .filter(result => !result.includes('i') && !result.includes('-'))
//         .map(value => Number(value))

export default autoAdaptNumericValues;