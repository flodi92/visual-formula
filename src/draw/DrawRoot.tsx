import React, { useLayoutEffect, useState } from 'react'

import { Component, ReactNode } from 'react'

// import React from "react";
import GAbstractValue from "../expression/gExpression/GAbstractValue";
import GSimpleValue from '../expression/gExpression/GSimpleValue';
import GValue from '../expression/gExpression/GValue';

import { zip, isEqual } from 'lodash';
import { Direction, ID } from '../types';
import GAbstractRoot from '../expression/gExpression/GAbstractRoot';
import { getGAbstractValueIds, getGAbstractValues } from '../utils/gExpression';

const STANDARD_STROKE_WIDHT = 1;
const HIDDEN_STROKE_WIDTH = 1;


class DrawValue {
  private _gaValue?: GAbstractValue | undefined;
  public get gaValue(): GAbstractValue | undefined {
    return this._gaValue;
  }
  public set gaValue(value: GAbstractValue | undefined) {
    this._gaValue = value;
  }

  public get id(): ID | undefined {
    return this._gaValue?.id
  }

  private renderGValue(gValue: GValue): ReactNode {
    if (!this.gaValue) return <></>
    const { x, y, width, height } = this.gaValue
    const edges = [gValue.xEdge, gValue.yEdge].filter(edge => !!edge) as Direction[];

    const xNorm = gValue.isNormX;
    const yNorm = gValue.isNormY;

    const [[p11, p12], [p21, p22]] = edges.map(
      (edge) =>
      ({
        left: [
          [x, y],
          [x, y + height],
        ],
        right: [
          [x + width, y],
          [x + width, y + height],
        ],
        top: [
          [x, y],
          [x + width, y],
        ],
        bottom: [
          [x, y + height],
          [x + width, y + height],
        ],
      }[edge])
    );

    const b = [p11, p12].find((p) =>
      [p21, p22].some((_p) => isEqual(_p, p))
    ) as number[]; //corner

    const a = [p11, p12].find((p) => !isEqual(p, b)) as number[];
    const c = [p21, p22].find((p) => !isEqual(p, b)) as number[];

    if (!xNorm && !yNorm) {
      const ba = zip(b, a).map(
        ([_b, _a]) => _b as number + Math.sign(_a as number - (_b as number)) * 15
      );
      const bc = zip(b, c).map(
        ([_b, _c]) => _b as number + Math.sign(_c as number - (_b as number)) * 15
      );
      const d = `M${a[0]},${a[1]} L${ba[0]},${ba[1]} Q${b[0]},${b[1]},${bc[0]},${bc[1]} L${c[0]},${c[1]}`;
      return (
        <path
          id={`path-${this.gaValue.id}`}
          key={`path-${this.gaValue.id}`}
          d={d} strokeWidth={STANDARD_STROKE_WIDHT}
          fill="none" />
      );

    }
  }

  private renderGSimpleValue(gValue: GSimpleValue): ReactNode {



    // const edge = gValue.edge();

    // const { x1, y1, x2, y2 } = getEdgeCoordinates({
    //   edge,
    //   x,
    //   y,
    //   width,
    //   height,
    // });

    // const d = `M${x1} ${y1} L ${x2} ${y2}`;

    // positioning = {
    //   left: { top: "50%", left: 0 },
    //   right: { top: "50%", right: 0 },
    //   top: { left: "50%", top: 0 },
    //   bottom: { left: "50%", bottom: 0 },
    // }[gValue.edge()];

    // const [cx, cy] = {
    //   top: [x1, y1],
    //   left: [x1, y1],
    //   bottom: [x2, y2],
    //   right: [x2, y2],
    // }[gValue.parent()?.startDirection()];

    // path = (
    //   <>
    //     <circle cx={cx} cy={cy} r={13} />
    //     <path
    //       d={d}
    //       strokeWidth={STANDARD_STROKE_WIDHT}
    //       strokeDasharray={"5,5"}
    //       fill="none"
    //     />
    //     <path
    //       d={d}
    //       className="transparent"
    //       strokeWidth={HIDDEN_STROKE_WIDTH}
    //     />
    //   </>
    // );




    return <></>
  }

  public render(): ReactNode {
    return (this.gaValue instanceof GValue) ?
      this.renderGValue(this.gaValue) :
      (this.gaValue instanceof GSimpleValue) ?
        this.renderGSimpleValue(this.gaValue) : <></>
  }
}


const DrawRoot = ({ root }: { root: GAbstractRoot }) => {

  const [drawValues, setDrawValues] = useState<DrawValue[]>([]);

  useLayoutEffect(() => {
    const gAValues = getGAbstractValues(root);
    const gAValueIds = getGAbstractValueIds(root);
    let _drawValues = [...drawValues].filter(drawnValue => drawnValue.id && gAValueIds.includes(drawnValue.id));

    gAValues.forEach(gaValue => {
      const foundDrawValue = _drawValues.find(drawValue => drawValue.id === gaValue.id);
      if (!!foundDrawValue) {
        foundDrawValue.gaValue = gaValue
      } else {
        const newDrawValue = new DrawValue()
        newDrawValue.gaValue = gaValue;
        _drawValues.push(newDrawValue)
      }
    })

    setDrawValues(_drawValues);
  }, [root]);

  return <svg>{drawValues.map(drawValue => drawValue.render())}</svg>

}

export default DrawRoot;