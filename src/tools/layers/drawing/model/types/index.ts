import {
  Feature,
  LineString,
  MultiLineString,
  MultiPoint,
  MultiPolygon,
  Point,
  Polygon,
} from '@turf/turf';
import { DrawEvents, LatLng, Layer } from 'leaflet';

export type LatLngs = LatLng[];

export type LayerType = 'marker' | 'polyline' | 'polygon' | 'painted' | 'vertice' | 'erased';

export type DrawnObject = Layer & {
  layerType: LayerType;
  options: { [key: string]: string | number };
  identifier: string;
  dragging?: { disable: () => void; enable: () => void };
  editing?: { _enabled: boolean; disable: () => void; enable: () => void };
  setStyle: (val: { [key: string]: string | number }) => void;
  popupContent?: string;
  _latlngs: LatLngs;
  toGeoJSON: () => GeoJSON.Feature | GeoJSON.FeatureCollection;
};

export type CreatedEvent = DrawEvents.Created & {
  layer: DrawnObject;
  layerType: LayerType;
};

export type TurfPolygon = Feature<Polygon | MultiPolygon> | Polygon | MultiPolygon;

export type GeoFeature = Feature<
  Point | MultiPoint | LineString | MultiLineString | Polygon | MultiPolygon
>;

export interface LooseObject {
  [key: string]: any;
}
