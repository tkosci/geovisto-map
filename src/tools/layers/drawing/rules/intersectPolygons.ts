import { DrawnObject, TurfPolygon } from "./../model/types/index";
import * as turf from "@turf/turf";
import { isLayerPoly } from "../util/polyHelpers";
import { operateOnSelectedAndCurrectLayer } from "./shared";

/**
 * @brief intersect selected object with the one being currently created
 *
 * @param {Layer} layer
 * @param {Number | undefined} eKeyIndex
 * @returns
 */
export const polyIntersect = (layer: DrawnObject, state: any): DrawnObject => {
  const selectedLayer = state.selectedLayer;
  if (!isLayerPoly(selectedLayer)) return layer;
  const { layer: updatedLayer, result } = operateOnSelectedAndCurrectLayer(
    layer,
    (a: GeoJSON.Feature, b: GeoJSON.Feature) =>
      turf.intersect(a as TurfPolygon, b as TurfPolygon) as GeoJSON.Feature,
    selectedLayer
  );

  if (result) {
    layer.remove();
  }

  return updatedLayer;
};
