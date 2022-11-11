import React, { useLayoutEffect, useState } from 'react';

import { ReactNode } from 'react'

import GAbstractValue from "../expression/gExpression/GAbstractValue";
import GSimpleValue from '../expression/gExpression/GSimpleValue';
import GValue from '../expression/gExpression/GValue';

import { zip } from 'lodash';
import { ID } from '../types';
import GAbstractRoot from '../expression/gExpression/GAbstractRoot';
import { getGAbstractValueIds, getGAbstractValues } from '../utils/gExpression';
import { MExpression, MDifference, MEquation, MProduct, MQuotient, MSum, MValue } from '../expression/mExpression';

const STANDARD_STROKE_WIDHT = 1;
const NORM_STROKE_WIDHT = 3;
const GVALUE_RADIUS = 15;
// const HIDDEN_STROKE_WIDTH = 1;
const ROUND_PADDING = 7;
const CORNER_PADDING = 3;
const FONT_SIZE = 11;

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
    const ba = zip(b, a).map(
      ([_b, _a]) => _b as number + Math.sign(_a as number - (_b as number)) * GVALUE_RADIUS
    );
    const bc = zip(b, c).map(
      ([_b, _c]) => _b as number + Math.sign(_c as number - (_b as number)) * GVALUE_RADIUS
    );
    if (!xNorm && !yNorm) {
      const d = `M${a[0]},${a[1]} L${ba[0]},${ba[1]} Q${b[0]},${b[1]},${bc[0]},${bc[1]} L${c[0]},${c[1]}`;
      return (
        <path
          id={`path-${this.gaValue.id}`}
          key={`path-${this.gaValue.id}`}
          d={d} strokeWidth={STANDARD_STROKE_WIDHT}
          stroke={gValue.isTerm1 ? "black" : "red"}
          fill="none" />
      );
    } else {
      const d1 = `M${a[0]} ${a[1]} L${b[0]} ${b[1]}`;
      const d2 = `M${b[0]} ${b[1]} L${c[0]} ${c[1]}`;
      const isNorm1 = (a[0] === b[0] && yNorm) || (a[1] === b[1] && xNorm)
      const isNorm2 = (b[0] === c[0] && yNorm) || (b[1] === c[1] && xNorm)

      return (
        <>
          <path
            id={`path1-${this.gaValue.id}`}
            key={`path1-${this.gaValue.id}`}
            d={d1} strokeWidth={isNorm1 ? NORM_STROKE_WIDHT : STANDARD_STROKE_WIDHT}
            stroke={gValue.isTerm1 ? "black" : "red"}
            fill="none" />
          <path
            id={`path2-${this.gaValue.id}`}
            key={`path2-${this.gaValue.id}`}
            d={d2} strokeWidth={isNorm2 ? NORM_STROKE_WIDHT : STANDARD_STROKE_WIDHT}
            stroke={gValue.isTerm1 ? "black" : "red"}
            fill="none" />
        </>
      )

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
        stroke={gValue.isTerm1 ? "black" : "red"}
        strokeDasharray={"5,5"}
        fill="none" />
    );
  }

  // TODO rename mValue => mExpression
  private rendeMValue(mValue?: MExpression) {
    const _renderValue = (mExpression?: MExpression): ReactNode => {
      if (!mExpression) return <></>

      let buffer;
      if (mExpression instanceof MValue) {
        buffer = (
          mExpression.isConstant ?
            // @ts-ignore    
            <mi>{(mExpression.mValue)}</mi>
            // @ts-ignore    
            : <mn>{(mExpression.mValue)}</mn>
        );
      } else if (mExpression instanceof MSum) {
        buffer = (
          mExpression?.mSummands?.map((mSummand, idx, { length }) => (
            <>
              {_renderValue(mSummand)}
              {/* @ts-ignore */}
              {idx < length - 1 && <mo>+</mo>}
            </>))
        );
      } else if (mExpression instanceof MDifference) {
        buffer = (
          <>
            {_renderValue(mExpression.mMinuend)}
            {/* @ts-ignore */}
            <mo>&minus;</mo>
            {_renderValue(mExpression.mSubtrahend)}
          </>
        );
      } else if (mExpression instanceof MProduct) {
        buffer = mExpression?.mFactors?.map((mFactor, idx, { length }) => {
          const isBracket = mFactor instanceof MValue;
          return (
            <>
              {/* @ts-ignore */}
              {isBracket && <mo>(</mo>}
              {_renderValue(mFactor)}
              {/* @ts-ignore */}
              {isBracket && <mo>)</mo>}
              {/* @ts-ignore */}
              {idx < length - 1 && <mo>&times;</mo>}
            </>
          );
        });
      } else if (mExpression instanceof MQuotient) {
        {/* TODO brackets */ }
        buffer = (
          // @ts-ignore
          <mfrac>
            {/* @ts-ignore */}
            <mrow> {_renderValue(mExpression.mDivident)} </mrow>
            {/* @ts-ignore */}
            <mrow> {_renderValue(mExpression.mDivisor)} </mrow>
            {/* @ts-ignore */}
          </mfrac>
        );
      } else if (mExpression instanceof MEquation) {
        buffer = (
          <>
            {_renderValue(mExpression.mTerm1)}
            {/* @ts-ignore */}
            <mo>=</mo>
            {_renderValue(mExpression.mTerm2)}
          </>
        )
      }
      return buffer;
    }

    const style = {
      fontFamily: "sans-serif",
      fontWeight: "bold",
    }
    return (
      ///@ts-ignore        
      <math {...style}>{_renderValue(mValue)}</math>
    );
  }

  private renderMValueInGValue(gValue: GAbstractValue) {

    const positioning = gValue instanceof GSimpleValue && gValue.edge ? ({
      left: { top: "50%", left: 0 },
      right: { top: "50%", right: 0 },
      top: { left: "50%", top: 0 },
      bottom: { left: "50%", bottom: 0 },
    }[gValue.edge]) :
      gValue instanceof GValue ?
        ({
          ...(gValue.yEdge === "left" ? { left: "0" } : { right: "0" }),
          ...(gValue.xEdge === "top" ? { top: "0" } : { bottom: "0" }),
        }) : { top: 0, left: 0 };

    const padding = gValue.isNormX || gValue.isNormY ?
      CORNER_PADDING :
      ROUND_PADDING;

    const { x, y, width, height } = gValue;
    return <foreignObject {...{ x, y, width, height }} style={{ padding: 0 }}>
      <div
        style={{
          width: `${width - 2 * padding}px`,
          height: `${height - 2 * padding}px`,
          margin: `${padding}px`,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            color: gValue.isTerm1 ? "black" : "red",
            fontSize: `${FONT_SIZE}px`,
            ...positioning,
          }}
        >
          {gValue instanceof GSimpleValue ?
            this.rendeMValue(gValue.mSimpleValue) :
            gValue instanceof GValue ?
              this.rendeMValue(gValue.mValue)
              : <></>}
        </div>
      </div>
    </foreignObject>
  }

  public render(): ReactNode {
    return (this.gaValue instanceof GValue) ?
      <>
        {this.renderGValue(this.gaValue)}
        {this.renderMValueInGValue(this.gaValue)}
      </>
      :
      (this.gaValue instanceof GSimpleValue) ?
        <>
          {this.renderGSimpleValue(this.gaValue)}
          {this.renderMValueInGValue(this.gaValue)}
        </> :
        <></>
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

  return <svg {...{ style }}>
    <rect
      fill='#88888844'
      {...{
        x: root.x,
        y: root.y,
        width: root.width,
        height: root.height
      }}
    />
    {drawValues.map(drawValue => drawValue.render())}
  </svg>

}

export default DrawRoot;