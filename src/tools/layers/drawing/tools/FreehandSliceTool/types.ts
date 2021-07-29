import { Path } from 'leaflet';
import { TAbstractTool } from '../AbstractTool/types';
import { TGeometricSliceTool } from '../GeometricSliceTool/types';

export interface TFreehandSliceTool extends TGeometricSliceTool {
  pather: Path;
  patherActive: boolean;
}
