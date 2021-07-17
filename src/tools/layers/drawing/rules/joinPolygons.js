import union from '@turf/union';
import { isLayerPoly } from '../util/polyHelpers';
import { operateOnSelectedAndCurrectLayer } from './shared';

/**
 * @brief unifies selected object with the one being currently created
 *
 * @param {Layer} layer
 * @param {Number | undefined} eKeyIndex
 * @returns
 */
export const polyJoin = (layer, state) => {
  const selectedLayer = state.selectedLayer;
  if (!isLayerPoly(selectedLayer)) return layer;
  const { layer: updatedLayer, result } = operateOnSelectedAndCurrectLayer(
    layer,
    union,
    selectedLayer,
  );

  if (result) {
    layer.remove();
    state.removeSelectedLayer();
    state.setSelectedLayer(updatedLayer);
  }

  return updatedLayer;
};
