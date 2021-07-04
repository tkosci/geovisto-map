import { getFeatFromLayer, isFeaturePoly, morphFeatureToPolygon } from '../util/Poly';

/**
 * @brief - takes selected object and currently created object
 *        and executes passed operation
 *        - used for union and intersection
 *
 * @param {Layer} layer
 * @param {Number | undefined} eKeyIndex
 * @param {Function} operation
 * @returns {{Layer, result: boolean}} geo. object
 */
export const operateOnSelectedAndCurrectLayer = (layer, eKeyIndex, operation, selectedLayer) => {
  let feature = getFeatFromLayer(layer);
  // * gets only first one because MultiPolygon is not expected to be created
  feature = Array.isArray(feature) ? feature[0] : feature;
  let isFeatPoly = isFeaturePoly(feature);
  if (!isFeatPoly) return { layer, result: false };

  let summedFeature = feature;

  // * this can be multipolygon whenever user joins 2 unconnected polygons
  let selectedFeatures = getFeatFromLayer(selectedLayer);
  if (!selectedFeatures) return { layer, result: false };

  // * selected feature may be multiple polygons so we sum them
  selectedFeatures.forEach((selectedFeature) => {
    let isSelectedFeaturePoly = isFeaturePoly(selectedFeature);

    if (isSelectedFeaturePoly) {
      summedFeature = operation(selectedFeature, summedFeature);
    }
  });

  layer = morphFeatureToPolygon(summedFeature, layer.options, false);

  return { layer, result: true };
};
