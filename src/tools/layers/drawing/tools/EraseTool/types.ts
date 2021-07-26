import { LeafletEvent } from 'leaflet';
import { CreatedEvent } from '../../model/types';
import { TPaintTool } from '../PaintTool/types';

export interface TEraseTool extends TPaintTool {
  created(e: CreatedEvent): void;
  startErase(): void;
  erase(event: LeafletEvent): void;
}
