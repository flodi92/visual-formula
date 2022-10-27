import React from 'react';
import './button.css';

import GAbstractRoot from '../expression/gExpression/GAbstractRoot';
import DrawRoot from '../draw/DrawRoot';
import { getExpressionFromJSON } from '../creation';
import { Direction} from '../types';

interface TestGExpressionProps {
  type: 'GSum' | 'GDifference' | 'GProduct1D' | 'GQuotient1D';
  startDirection: Direction;
  width1: number,
  height1: number,
  width2: number,
  height2: number,
}

export const TestGExpression = ({ type, startDirection, width1, height1, width2, height2 }: TestGExpressionProps) => {
  const child1 = {
    type: 'GValue',
    mValue: '1',
    numbericValue: 2,
    xEdge: "bottom", yEdge: "left",
    unscaledWidth: width1, unscaledHeight: height1,
  };
  const child2 = {
    type: 'GValue',
    mValue: '1',
    numbericValue: 2,
    xEdge: "top", yEdge: "right",
    unscaledWidth: width2, unscaledHeight: height2,
  };
  const simpleChild1 = {
    type: 'GSimpleValue',
    mValue: '1',
    numbericValue: 2,
    edge: "bottom",
    unscaledWidth: width1, unscaledHeight: height1,
  };

  const json = (type === "GSum" ? {
    type: "GSum",
    startDirection,
    gSummands: [
      child1, child2
    ]
  } 
  : type === "GDifference" ? {
    type: "GDifference",
    startDirection,
    gMinuend: child1,
    gSubtrahend: child2,
  }
  : type === "GProduct1D" ? {
    type: "GProduct1D",
    startDirection,
    gComplexFactor: child2,
    gSimpleFactor: simpleChild1,
  }
  : type === "GQuotient1D" ? {
    type: "GQuotient1D",
    startDirection,
    gComplexDivident: child2,
    gSimpleDivisor: simpleChild1,
  }
  : {})

  const root = getExpressionFromJSON(json) as GAbstractRoot;

  root.layerTransformation = { x: 40, y: 30, scaleX: 20, scaleY: 20 }

  return <DrawRoot root={root} style={{ width: '100%', height: '100%' }} />;
};
