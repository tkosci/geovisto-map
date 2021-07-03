import * as turf from '@turf/turf';
import { operateOnSelectedAndCurrectLayer } from './shared';

/**
 * @brief intersect selected object with the one being currently created
 *
 * @param {Layer} layer
 * @param {Number | undefined} eKeyIndex
 * @returns
 */
export const polyIntersect = (layer, eKeyIndex, state) => {
  const selectedLayer = state.selectedLayer;
  const updatedLayer = operateOnSelectedAndCurrectLayer(
    layer,
    eKeyIndex,
    turf.intersect,
    selectedLayer,
  );

  return updatedLayer;
};
