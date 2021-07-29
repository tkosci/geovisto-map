import { CreatedEvent, DrawnObject } from '../../model/types';
import { TAbstractTool } from '../AbstractTool/types';

export interface TGeometricSliceTool extends TAbstractTool {
  created(e: CreatedEvent): void;
  polySlice(layer: DrawnObject): void;
  _dividePoly(): void;
}
