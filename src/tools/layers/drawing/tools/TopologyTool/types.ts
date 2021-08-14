import { LatLng, Marker, Polyline } from "leaflet";
import { DragEvent } from "react";
import { DrawnObject, LooseObject, Optional } from "../../model/types";
import { MappedMarkersToVertices } from "../../model/types/tool/IDrawingLayerToolState";
import { TMarkerTool } from "../MarkerTool/types";

export interface TTopologyTool extends TMarkerTool {
  isConnectMarker(layer: DrawnObject): boolean;
  plotTopology(
    chosen: Optional<DrawnObject[]>,
    createdMarker: Optional<DrawnObject>
  ): void;
  _haveSameVertice(current: Polyline): boolean;
  _mapMarkersToVertices(_markers: CustomMarker[]): void;
  applyTopologyMarkerListeners(layer: DrawnObject, state: any): void;
  changeVerticesLocation(
    latlng: LatLng,
    markerVertices?: MappedMarkersToVertices
  ): void;
}

export type CustomMarker = Marker & {
  _leaflet_id: string;
};

export type LeafletDrag = DragEvent & {
  latlng: LatLng;
  oldLatLng: LatLng;
  target: LooseObject & { _leaflet_id: string };
};
