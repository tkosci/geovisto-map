import { DrawnObject } from './../../model/types/index';
import { TAbstractTool } from '../AbstractTool/types';

export interface TDeselectTool extends TAbstractTool {
  deselect(el: DrawnObject): void;
}
