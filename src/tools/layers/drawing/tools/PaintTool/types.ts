import { CircleMarker, LatLng, Layer } from 'leaflet';
import { TAbstractTool } from './../AbstractTool/types';

export interface TPaintTool extends TAbstractTool {
  tabState: any;
  _action: 'draw' | 'erase' | null;
  _circle: CircleMarker | null;
  _mouseDown: boolean;
  _latlng: LatLng;
  _maxCircleRadius: number;
  _minCircleRadius: number;
  _circleRadius: number;
  _accumulatedShape: GeoJSON.Feature | null;
  _shapeLayer: Layer | null;
}
