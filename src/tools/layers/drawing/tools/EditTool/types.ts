import { DrawnObject } from '../../model/types';
import { TAbstractTool } from '../AbstractTool/types';

export interface TEditTool extends TAbstractTool {
  initNodeEdit(selectedLayer: DrawnObject, disable: boolean): void;
  disableNodeEdit(selectedEl: DrawnObject): void;
}
