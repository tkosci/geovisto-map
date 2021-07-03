import union from '@turf/union';
import { operateOnSelectedAndCurrectLayer } from './shared';

/**
 * @brief unifies selected object with the one being currently created
 *
 * @param {Layer} layer
 * @param {Number | undefined} eKeyIndex
 * @returns
 */
export const polyJoin = (layer, eKeyIndex, state) => {
  const selectedLayer = state.selectedLayer;
  const updatedLayer = operateOnSelectedAndCurrectLayer(layer, eKeyIndex, union, selectedLayer);

  state.removeSelectedLayer();
  state.setSelectedLayer(layer);

  return updatedLayer;
};
