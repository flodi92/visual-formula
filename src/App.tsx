import React from 'react';
// import logo from './logo.svg';
import './App.scss';
import GAbstractRoot from './expression/gExpression/GAbstractRoot';
import { getExpressionFromJSON } from './conversion';
import { DrawRoot, useInteractionHandlers } from './drawReact';


const Test = () => {
  const { root, ...interactionProps } = useInteractionHandlers(exampleJSON, 20);

  if (!root) return <></>;

  return <DrawRoot {...{ root, ...interactionProps }} style={{ width: '100%', height: '100%' }} />
}

function App() {
  return (
    <div className="App" style={{ marginLeft: '20px', marginTop: '20px' }}>
      <Test />
    </div>
  );
}

export default App;

const exampleJSON = {
  type: "GEquation",
  id: 41,
  gTerm1: {
    type: "GQuotient2D",
    id: 42,
    gDivident: {
      type: "GSum",
      id: 43,
      startDirection: "left",
      gSummands: [
        {
          type: "GProduct1D",
          id: 44,
          startDirection: "left",
          gComplexFactor: {
            type: "GValue",
            id: 45,
            mValue: "5",
            numericValue: 5,
            xEdge: "top",
            yEdge: "left",
          },
          gSimpleFactor: {
            type: "GSimpleValue",
            id: 46,
            mSimpleValue: "x",
            numericValue: 2,
            edge: "top",
          },
        },
        {
          type: "GValue",
          id: 47,
          mValue: "6",
          numericValue: 6,
          xEdge: "top",
          yEdge: "left",
        },
      ],
    },
    gDivisor: {
      type: "GValue",
      id: 48,
      mValue: "4",
      numericValue: 4,
      xEdge: "top",
      yEdge: "left",
    },
    divisorEdge: "right",
    resultEdge: "bottom",
  },
  gTerm2: {
    type: "GDifference",
    id: 49,
    startDirection: "left",
    gMinuend: {
      type: "GProduct1D",
      id: 50,
      startDirection: "left",
      gComplexFactor: {
        type: "GValue",
        id: 51,
        mValue: "7",
        numericValue: 7,
        xEdge: "bottom",
        yEdge: "right",
      },
      gSimpleFactor: {
        type: "GSimpleValue",
        id: 52,
        mSimpleValue: "x",
        numericValue: 2,
        edge: "bottom",
      },
    },
    gSubtrahend: {
      type: "GValue",
      id: 53,
      mValue: "10",
      numericValue: 10,
      xEdge: "top",
      yEdge: "left",
    },
  },
};