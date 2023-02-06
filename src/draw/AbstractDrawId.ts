import { GExpression } from '../expression/gExpression';
import AbstractDraw from './AbstractDraw';

abstract class AbstractDrawId<T> extends AbstractDraw<T, GExpression>{ }

export default AbstractDrawId;