import { LatLng, Marker, Polyline } from "leaflet";
import { DragEvent } from "react";
import { DrawnObject, LooseObject, Optional } from "../../model/types";
import { TMarkerTool } from "../MarkerTool/types";

export interface TTopologyTool extends TMarkerTool {
  isConnectMarker(layer: DrawnObject): boolean;
  plotTopology(
    chosen: Optional<DrawnObject[]>,
    createdMarker: Optional<DrawnObject>
  ): void;
  _haveSameVertice(current: Polyline): boolean;
  _mapMarkersToVertices(_markers: CustomMarker[]): void;
}

export type CustomMarker = Marker & {
  _leaflet_id: string;
};

export type LeafletDrag = DragEvent & {
  latlng: LatLng;
  oldLatLng: LatLng;
  target: LooseObject & { _leaflet_id: string };
};
