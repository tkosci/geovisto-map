import L from 'leaflet';
import difference from '@turf/difference';
import { getFirstGeoJSONFeature, isLayerPoly } from '../util/Poly';
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
  // if (this.paintPoly) this.paintPoly?.clearPaintedPolys(replacedLayer.kIdx);
};

const diffLayers = (l, selectedLayer, createdIsEraser, intersect, layerFeature, state) => {
  if (!l) return;
  let feature = getFirstGeoJSONFeature(l);

  let layerIsNotSelected = l?._leaflet_id !== selectedLayer?._leaflet_id;
  let canDiff = !createdIsEraser ? true : layerIsNotSelected;
  if (canDiff || intersect) {
    let diffFeature = difference(feature, layerFeature);

    if (diffFeature) {
      let coords;
      let latlngs;
      coords = diffFeature.geometry.coordinates;
      let isMultiPoly = diffFeature.geometry.type === 'MultiPolygon';
      let isJustPoly = diffFeature.geometry.type === 'Polygon';
      // * when substracting you can basically slice polygon into more parts
      // * then we have to increase depth by one because we have an array within array
      let depth = isMultiPoly ? 2 : 1;
      try {
        // * this conditional asks if created polygon is polygon with hole punched in it
        // * for the rest of cases i.e. when polygon is split into multiple parts or not we use loop
        // * otherwise we create polygon where hole should be
        if (isJustPoly && coords.length !== 1) {
          latlngs = L.GeoJSON.coordsToLatLngs(coords, 1);
          let result = new L.polygon(latlngs, {
            ...l.options,
          });
          replaceLayer(state, result, l);
        } else {
          coords.forEach((coord) => {
            latlngs = L.GeoJSON.coordsToLatLngs([coord], depth);
            let result = new L.polygon(latlngs, {
              ...l.options,
            });
            let newLatLngs = depth === 1 ? result._latlngs : result._latlngs[FIRST];
            replaceLayer(state, result, l, newLatLngs);
          });
        }
      } catch (error) {
        console.error({ coords, latlngs, error, depth });
      }
    } else {
      state.removeLayer(l);
      // if (this.paintPoly) this.paintPoly?.clearPaintedPolys(l.kIdx);
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
  let selectedLayer = state.selectedLayer;
  let fgLayers = state.featureGroup._layers;

  let layerFeature = getFirstGeoJSONFeature(layer);
  let isCurrentLayerPoly = isLayerPoly(layer);

  // let createdIsNotEraser = layer.layerType !== 'erased';
  let createdIsEraser = layer.layerType === 'erased';

  if (isCurrentLayerPoly) {
    // * if intersect is active execute difference with only selected polygon
    if (intersect && !createdIsEraser) {
      diffLayers(selectedLayer, selectedLayer, createdIsEraser, intersect, layerFeature, state);
    } else {
      Object.values(fgLayers)
        .filter((l) => isLayerPoly(l))
        .forEach((l) => {
          diffLayers(l, selectedLayer, createdIsEraser, intersect, layerFeature, state);
        });
    }
  }
};
