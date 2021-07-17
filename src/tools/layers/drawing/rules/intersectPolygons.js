import * as turf from '@turf/turf';
import { isLayerPoly } from '../util/polyHelpers';
import { operateOnSelectedAndCurrectLayer } from './shared';

/**
 * @brief intersect selected object with the one being currently created
 *
 * @param {Layer} layer
 * @param {Number | undefined} eKeyIndex
 * @returns
 */
export const polyIntersect = (layer, state) => {
  const selectedLayer = state.selectedLayer;
  if (!isLayerPoly(selectedLayer)) return layer;
  const { layer: updatedLayer, result } = operateOnSelectedAndCurrectLayer(
    layer,
    turf.intersect,
    selectedLayer,
  );

  if (result) {
    layer.remove();
  }

  return updatedLayer;
};
