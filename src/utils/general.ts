import { Direction, XDirection, XY, YDirection } from "../types";

export const oppositeDirection = (direction: Direction | undefined, xy?: XY) => direction && ({
    left: xy === 'Y' ? 'left' : 'right',
    right: xy === 'Y' ? 'right' : 'left',
    top: xy === 'X' ? 'top' : 'bottom',
    bottom: xy === 'X' ? 'bottom' : 'top'
}[direction]) as Direction | undefined

export const directionToXY = (direction?: Direction) => (direction && {
    left: 'X',
    right: 'X',
    top: 'Y',
    bottom: 'Y'
}[direction]) as XY;

export const getOtherXY = (direction?: XY) => (direction && {
    Y: 'X',
    X: 'Y',
}[direction]) as XY;

export const directionToNumber = (val?: Direction) =>
(val && {
    top: 0,
    right: 1,
    bottom: 2,
    left: 3,
}[val]);

export const directionsToNumber = (xDirection?: XDirection, YDirection?: YDirection) =>
    xDirection && YDirection
    && Math.max(... <number[]>[xDirection, YDirection].map(edge => directionToNumber(edge)))

export const getSwappedDirection = (direction?: Direction) =>
    (direction && {
        top: "left",
        right: "bottom",
        bottom: "right",
        left: "top",
    }[direction]) as (Direction | undefined);

export const getRotatedDirection = (direction: Direction | undefined, isClockwise: boolean) =>
    (direction && (isClockwise
        ? {
            left: "top",
            bottom: "left",
            right: "bottom",
            top: "right",
        }
        : {
            top: "left",
            left: "bottom",
            bottom: "right",
            right: "top",
        })[direction]) as (Direction | undefined);

export const isOrthogonal = (a?: Direction, b?: Direction) =>
    a && b && (directionToNumber(a) as number) % 2 !== (directionToNumber(b) as number) % 2;

export const isClockwise = (fromDirection?: Direction, toDirection?: Direction) => {
    if (!fromDirection || !toDirection) return;
    const [fromNumber, toNumber] = [fromDirection, toDirection].map((direction) =>
        direction && directionToNumber(direction) as number
    );
    return {
        0: undefined,
        1: true, // clockwise
        2: undefined,
        3: false, // anticlickwise
    }[(toNumber - fromNumber + 4) % 4];
};