import L from 'leaflet';
import difference from '@turf/difference';
import { getConversionDepth, getFirstGeoJSONFeature, isLayerPoly } from '../util/Poly';
import { FIRST, normalStyles } from '../util/constants';

const replaceLayer = (state, replacement, replacedLayer, replacementCoords) => {
  replacement?.dragging?.disable();
  replacement.layerType = 'polygon';
  if (replacementCoords) replacement._latlngs = replacementCoords;
  replacement.identifier = replacedLayer.identifier;
  replacement.setStyle({ ...replacement.options, ...normalStyles });
  let content = replacedLayer.popupContent;
  if (content) {
    replacement.bindPopup(content, {
      closeOnClick: false,
      autoClose: false,
    });
    replacement.popupContent = content;
  }
  state.addLayer(replacement);
  state.removeLayer(replacedLayer);
};

const diffLayers = (geoObject, layerFeature, state, canDiff) => {
  if (!geoObject) return;
  let feature = getFirstGeoJSONFeature(geoObject);

  if (canDiff) {
    let diffFeature = difference(feature, layerFeature);

    if (diffFeature) {
      let coords;
      let latlngs;
      coords = diffFeature.geometry.coordinates;
      let isJustPoly = diffFeature.geometry.type === 'Polygon';
      // * when substracting you can basically slice polygon into more parts,\
      // * then we have to increase depth by one because we have an array within an array
      let depth = getConversionDepth(diffFeature);
      try {
        // * - this conditional asks if created polygon is polygon with hole punched in it
        // * - for the rest of cases i.e. when polygon is split into multiple parts or not, we use loop\
        // * otherwise we create polygon, where hole should be
        if (isJustPoly && coords.length !== 1) {
          latlngs = L.GeoJSON.coordsToLatLngs(coords, 1);
          let result = new L.polygon(latlngs, {
            ...geoObject.options,
          });
          replaceLayer(state, result, geoObject);
        } else {
          coords.forEach((coord) => {
            latlngs = L.GeoJSON.coordsToLatLngs([coord], depth);
            let result = new L.polygon(latlngs, {
              ...geoObject.options,
            });
            let newLatLngs = depth === 1 ? result._latlngs : result._latlngs[FIRST];
            replaceLayer(state, result, geoObject, newLatLngs);
          });
        }
      } catch (error) {
        console.error({ coords, latlngs, error, depth });
      }
    } else {
      state.removeLayer(geoObject);
    }
  }
};

/**
 * @brief takes currently created polygon and loops through each polygon
 *        and executes operation 'difference'
 *
 * @param {Layer} layer
 * @param {Boolean} intersect
 */
export const polyDiff = (layer, state, intersect = false) => {
  let layerFeature = getFirstGeoJSONFeature(layer);
  let isCurrentLayerPoly = isLayerPoly(layer);
  let createdIsNotEraser = layer.layerType !== 'erased';

  if (isCurrentLayerPoly) {
    let selectedLayer = state.selectedLayer;
    // * - if intersect is active execute difference with only selected polygon
    // * - part of condition with 'selectedLayer' is here b/c, when you have intersect on\
    // * without selecting object stroke/object user creates stayes on top of everything
    if (intersect && createdIsNotEraser && selectedLayer) {
      diffLayers(selectedLayer, layerFeature, state, true);
    } else {
      let fgLayers = state.featureGroup._layers;
      // * else we execute difference with each geo. object
      Object.values(fgLayers)
        .filter((geoObject) => isLayerPoly(geoObject))
        .forEach((geoObject) => {
          // * we want to avoid damaging selected layer
          let objectIsNotSelected = geoObject?._leaflet_id !== selectedLayer?._leaflet_id;
          let canDiff = createdIsNotEraser && objectIsNotSelected;
          diffLayers(geoObject, layerFeature, state, canDiff);
        });
    }
  }
};
