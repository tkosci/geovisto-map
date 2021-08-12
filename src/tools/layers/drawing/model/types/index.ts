import { LooseObject } from './index';
import {
  Feature,
  LineString,
  MultiLineString,
  MultiPoint,
  MultiPolygon,
  Point,
  Polygon,
} from '@turf/turf';
import { DrawEvents, Icon, LatLng, Layer } from 'leaflet';
import { LeafletDrag } from '../../tools/TopologyTool/types';

export type LatLngs = LatLng[];

export type LayerType =
  | 'marker'
  | 'polyline'
  | 'polygon'
  | 'painted'
  | 'vertice'
  | 'erased'
  | 'search';

export type DrawnObject = Layer & {
  layerType: LayerType;
  options: { [key: string]: string | number } & { icon?: { options: LooseObject } };
  identifier: string;
  dragging?: { _enabled: boolean; disable: () => void; enable: () => void };
  editing?: { _enabled: boolean; disable: () => void; enable: () => void };
  transform?: {
    _enabled: boolean;
    disable: () => void;
    enable: (opt: { rotation: boolean; scaling: boolean }) => void;
  };
  setStyle: (val: { [key: string]: string | number } | string) => void;
  popupContent?: string;
  _latlngs: LatLngs;
  _leaflet_id: LatLngs;
  toGeoJSON: () => GeoJSON.Feature | GeoJSON.FeatureCollection;
  on(type: 'drag', fn: (e: LeafletDrag) => void): void;
  setIcon: (icon: Icon<LooseObject>) => void;
  countryCode?: string;
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

export type Optional<T> = T | null;
