import { TurfPolygon } from "./../model/types/index";
import union from "@turf/union";
import { DrawnObject } from "../model/types";
import { isLayerPoly } from "../util/polyHelpers";
import { operateOnSelectedAndCurrectLayer } from "./shared";

/**
 * @brief unifies selected object with the one being currently created
 */
export const polyJoin = (layer: DrawnObject, state: any): DrawnObject => {
  const selectedLayer = state.selectedLayer;
  if (!isLayerPoly(selectedLayer)) return layer;
  const { layer: updatedLayer, result } = operateOnSelectedAndCurrectLayer(
    layer,
    (a: GeoJSON.Feature, b: GeoJSON.Feature) =>
      union(a as TurfPolygon, b as TurfPolygon) as GeoJSON.Feature,
    selectedLayer
  );

  if (result) {
    layer.remove();
    state.removeSelectedLayer();
    state.setSelectedLayer(updatedLayer);
  }

  return updatedLayer;
};
