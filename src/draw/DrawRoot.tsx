import React, { useLayoutEffect, useState } from 'react'

import { ReactNode } from 'react'

import GAbstractValue from "../expression/gExpression/GAbstractValue";
import GSimpleValue from '../expression/gExpression/GSimpleValue';
import GValue from '../expression/gExpression/GValue';

import { zip } from 'lodash';
import { ID } from '../types';
import GAbstractRoot from '../expression/gExpression/GAbstractRoot';
import { getGAbstractValueIds, getGAbstractValues } from '../utils/gExpression';

const STANDARD_STROKE_WIDHT = 1;
// const HIDDEN_STROKE_WIDTH = 1;

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
    const [xEdge, yEdge] = [gValue.xEdge, gValue.yEdge];

    const xNorm = gValue.isNormX;
    const yNorm = gValue.isNormY;

    const [a, b, c] =
      (
        (xEdge === "top" && yEdge === "left")
          ? [
            [x, y + height],
            [x, y],
            [x + width, y],
          ] :
          (xEdge === "bottom" && yEdge === "left")
            ? [
              [x, y],
              [x, y + height],
              [x + width, y + height],
            ] :
            (xEdge === "bottom" && yEdge === "right")
              ? [
                [x + width, y],
                [x + width, y + height],
                [x, y + height],
              ] :
              (xEdge === "top" && yEdge === "right")
                ? [
                  [x, y],
                  [x + width, y],
                  [x + width, y + height],
                ] :
                [])

    if (!a || !b || !c) return <></>

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
          stroke="red"
          fill="none" />
      );

    }
  }

  private renderGSimpleValue(gValue: GSimpleValue): ReactNode {
    if (!this.gaValue) return <></>
    const { x, y, width, height } = this.gaValue;
    const edge = gValue.edge;

    const [x1, y1, x2, y2] =
      edge === "top" ? [x, y, x + width, y]
        : edge === "left" ? [x, y, x, y + height]
          : edge === "bottom" ? [x, y + height, x + width, y + height]
            : edge === "right" ? [x + width, y, x + width, y + height]
              : []

    const d = `M${x1} ${y1} L ${x2} ${y2}`;
    return (
      <path
        id={`path-${this.gaValue.id}`}
        key={`path-${this.gaValue.id}`}
        d={d} strokeWidth={STANDARD_STROKE_WIDHT}
        stroke="red"
        strokeDasharray={"5,5"}
        fill="none" />
    );
  }

  public render(): ReactNode {
    return (this.gaValue instanceof GValue) ?
      this.renderGValue(this.gaValue) :
      (this.gaValue instanceof GSimpleValue) ?
        this.renderGSimpleValue(this.gaValue) : <></>
  }
}


const DrawRoot = ({ root, style }: { root: GAbstractRoot, style: any }) => {

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
    // eslint-disable-next-line
  }, [root]);

  return <svg {...{ style }}>{drawValues.map(drawValue => drawValue.render())}</svg>

}

export default DrawRoot;