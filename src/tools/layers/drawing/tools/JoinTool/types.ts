import { DrawnObject, Optional, TurfPolygon } from '../../model/types';
import { TTopologyTool } from '../TopologyTool/types';

export interface TJoinTool extends TTopologyTool {
  canPushToChosen(layer: DrawnObject): boolean;
  chosenLayersArePolys(): boolean;
  chosenLayersAreMarkers(): boolean;
  chosenLayersMaxed(): boolean;
  pushChosenLayer(layer: DrawnObject): void;
  deselectChosenLayers(): void;
  clearChosenLayers(): void;
  pushJoinedToChosenLayers(joined: DrawnObject): void;
  _getSummedFeature(features: Optional<GeoJSON.Feature[]>): Optional<TurfPolygon>;
  joinChosen(drawObject: DrawnObject): void;
}
