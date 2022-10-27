import React from 'react';
// import logo from './logo.svg';
import './App.css';
import GAbstractRoot from './expression/gExpression/GAbstractRoot';
import DrawRoot from './draw/DrawRoot';
import { getExpressionFromJSON } from './creation';


const Test = () => {
  const root = getExpressionFromJSON({
    type: 'GValue',
    mValue: '1',
    xEdge: 'bottom',
    yEdge: 'left',
    unscaledWidth: 2,
    unscaledHeight: 2,
    numbericValue: 2,
  }) as GAbstractRoot;

  root.layerTransformation = { x: 30, y: 30, scaleX: 10, scaleY: 10 }

  return <DrawRoot root={root} style={{ backgroundColor: 'gray', width: '100%', height: '100%' }} />
}

function App() {
  return (
    <div className="App">
      <Test />
    </div>
  );
}

export default App;
