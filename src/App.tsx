import React from 'react';
// import logo from './logo.svg';
import './App.scss';
import GAbstractRoot from './expression/gExpression/GAbstractRoot';
import { getExpressionFromJSON } from './conversion';
import { DrawRoot, useInteractionHandlers } from './drawReact';


const Test = () => {
  const _root = getExpressionFromJSON({
    type: 'GValue',
    mValue: '1',
    xEdge: 'bottom',
    yEdge: 'left',
    unscaledWidth: 2,
    unscaledHeight: 2,
    numericValue: 2,
  }) as GAbstractRoot;

  _root.layerTransformation = { x: 30, y: 30, scaleX: 10, scaleY: 10 }

  const { root, ...interactionProps } = useInteractionHandlers(_root);

  if (!root) return <></>;
  
  return <DrawRoot {...{ root, ...interactionProps }} style={{ backgroundColor: 'gray', width: '100%', height: '100%' }} />
}

function App() {
  return (
    <div className="App">
      <Test />
    </div>
  );
}

export default App;
