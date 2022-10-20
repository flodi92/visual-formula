import { Direction, XY } from "../types";

export const oppositeDirection = (direction?: Direction) => direction && ({
    left: 'right',
    right: 'left',
    top: 'bottom',
    bottom: 'top'
}[direction]) as Direction | undefined

export const directionToXY = (direction: Direction) => ({
    left: 'X',
    right: 'X',
    top: 'Y',
    bottom: 'Y'
}[direction]) as XY;

export const getOtherXY = (direction: XY) => ({
    Y: 'X',
    X: 'Y',
}[direction]) as XY;

export const directionToNumber = (val: Direction) =>
({
    top: 0,
    right: 1,
    bottom: 2,
    left: 3,
}[val]);

export const isOrthogonal = (a: Direction, b: Direction) =>
    directionToNumber(a) % 2 !== directionToNumber(b) % 2;