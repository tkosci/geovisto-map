import L from 'leaflet';
import 'leaflet-path-drag';
import 'leaflet-path-transform';
import 'leaflet-draw';

import 'leaflet/dist/leaflet.css';

import { STROKES, COLORS } from '../sidebar/DrawingLayerToolTabControlState';

import '../components/Knife';

import * as turf from '@turf/turf';

export const highlightStyles = { fillOpacity: 0.5, opacity: 0.2 };
export const normalStyles = { fillOpacity: 0.2, opacity: 0.5 };

/**
 * @author Andrej Tlcina
 */

/**
 * enables creation of polygons
 *
 * @param {Object} map
 * @param {Object} sidebar
 * @returns
 */
export const polygonCreate = (map, sidebar) => {
  const x = new L.Draw.Polygon(map, {
    allowIntersection: false,
    drawError: {
      color: '#e1e100',
      message: '<strong>You cannot draw that!<strong>',
    },
    shapeOptions: {
      color: sidebar.getState().getSelectedColor(),
      weight: sidebar.getState().getSelectedStroke(),
      draggable: true,
      transform: true,
    },
    guideLayers: sidebar.getState().guideLayers,
    snapDistance: 5,
    repeatMode: true,
  });
  if (x) sidebar.getState().setEnabledEl(x);
  x.enable();
  return x;
};

/**
 * enables creation of polylines
 *
 * @param {Object} map
 * @param {Object} sidebar
 * @returns
 */
export const polylineCreate = (map, sidebar) => {
  const x = new L.Draw.Polyline(map, {
    shapeOptions: {
      color: sidebar.getState().getSelectedColor(),
      weight: sidebar.getState().getSelectedStroke(),
      draggable: true,
      transform: true,
    },
    guideLayers: sidebar.getState().guideLayers,
    repeatMode: true,
  });
  if (x) sidebar.getState().setEnabledEl(x);
  x.enable();
  return x;
};

/**
 * enables freehand slicing
 *
 * @param {Object} map
 * @param {Object} sidebar
 * @returns
 */
export const slicePoly = (map, sidebar) => {
  const pather = sidebar.getState().pather;
  const patherStatus = sidebar.getState().patherActive;
  if (!patherStatus) {
    map.addLayer(pather);
    sidebar.getState().setEnabledEl({
      disable: () => {
        map.removeLayer(pather);
        sidebar.getState().setPatherStatus(false);
      },
    });
  } else {
    map.removeLayer(pather);
    sidebar.getState().setEnabledEl(null);
  }

  sidebar.getState().setPatherStatus(!patherStatus);
};

/**
 * enables angular slicing
 *
 * @param {Object} map
 * @param {Object} sidebar
 * @returns
 */
export const dividePoly = (map, sidebar) => {
  const x = new L.Draw.Slice(map, {
    shapeOptions: {
      color: '#333',
      weight: 3,
      draggable: true,
      transform: true,
      guideLayers: sidebar.getState().guideLayers,
    },
  });
  x.enable();
  sidebar.getState().setEnabledEl(x);
  return x;
};

/**
 * gets GeoJSON representation from layer structure
 *
 * @param {Layer} layer
 * @returns
 */
export const getGeoJSONFeatureFromLayer = (layer) => {
  let geoFeature = layer.toGeoJSON();
  let feature = geoFeature.type === 'FeatureCollection' ? geoFeature.features[0] : geoFeature;
  return feature;
};

/**
 * reverses GeoJSON coordinates to Leaflet coordinater
 *
 * @param {Array<Number>} featureCoordinates
 * @param {String} type
 * @returns {Array<Number>}
 */
export const featureToLeafletCoordinates = (featureCoordinates, type = 'Polygon') => {
  let point;
  if (type === 'Point') {
    point = L.latLng(featureCoordinates.reverse());
    if (point) {
      featureCoordinates = [point.lng, point.lat];
    }
    return featureCoordinates;
  } else if (type === 'LineString') {
    for (let i = 0; i < featureCoordinates.length; i++) {
      point = L.latLng(featureCoordinates[i]);
      if (point) {
        featureCoordinates[i] = [point.lng, point.lat];
      }
    }
    return featureCoordinates;
  } else if (type === 'Polygon') {
    for (let i = 0; i < featureCoordinates.length; i++) {
      for (let j = 0; j < featureCoordinates[i].length; j++) {
        point = L.latLng(featureCoordinates[i][j]);
        if (point) {
          featureCoordinates[i][j] = [point.lng, point.lat];
        }
      }
    }
  }

  return featureCoordinates;
};

/**
 * maps feature types to leaflet types
 *
 * @param {String} feature
 * @returns
 */
export const getLeafletTypeFromFeature = (feature) => {
  switch (feature?.geometry?.type) {
    case 'Polygon':
      return 'polygon';
    case 'LineString':
      return 'polyline';
    case 'Point':
      return 'marker';
    default:
      return '';
  }
};

/**
 * converts GeoJSON properties to Leaflet options
 *
 * @param {Object} properties
 * @returns
 */
export const convertPropertiesToOptions = (properties) => {
  let options = { draggable: true, transform: true };
  if (!properties) return options;
  options.weight = properties['stroke-width'] || STROKES[1].value;
  options.color = properties['fill'] || COLORS[0];
  options.fillOpacity = properties['fill-opacity'] || normalStyles.fillOpacity;
  options.opacity = properties['stroke-opacity'] || normalStyles.opacity;

  return options;
};

/**
 * converts Leaflet options to GeoJSON properties
 *
 * @param {Object} properties
 * @returns
 */
export const convertOptionsToProperties = (options) => {
  let properties = { draggable: true, transform: true };
  properties['stroke-width'] = options.weight || STROKES[1].value;
  properties['fill'] = options.color || COLORS[0];
  // * so we don't save selected polygon
  properties['fill-opacity'] = normalStyles.fillOpacity;
  properties['stroke-opacity'] = normalStyles.opacity;

  return properties;
};

/**
 * returns GeoJSON representation, always array of them
 *
 * @param {Layer} layer
 * @returns {Array}
 */
export const getFeatFromLayer = (layer) => {
  if (!layer) return null;
  let drawnGeoJSON = layer.toGeoJSON();
  let feature;
  feature = drawnGeoJSON.type === 'FeatureCollection' ? drawnGeoJSON.features : [drawnGeoJSON];
  return feature;
};

/**
 * checks if feature is polygon
 *
 * @param {Object} feature
 * @returns
 */
export const isFeaturePoly = (feature) => {
  if (!feature) return false;
  if (feature?.type === 'FeatureCollection') {
    let f = feature.features[0];
    return f?.geometry?.type === 'Polygon' || f?.geometry?.type === 'MultiPolygon';
  }
  return feature?.geometry?.type === 'Polygon' || feature?.geometry?.type === 'MultiPolygon';
};

/**
 * simplifies polygon feature according to pixels
 *
 * @param {Object} feature
 * @param {Number} pixels
 * @returns {Object} GeoJSON polygon
 */
export const simplifyFeature = (feature, pixels) => {
  const tolerance = pixels || window.customTolerance;

  const result = turf.simplify(feature, { tolerance });
  return result;
};

/**
 * checks if layer structure is polygon
 *
 * @param {Layer} layer
 * @returns
 */
export const isLayerPoly = (layer) => {
  let feature = getGeoJSONFeatureFromLayer(layer);
  return isFeaturePoly(feature);
};

/**
 * helper function for morphing GeoJSON feature to Polygon {Layer} structure
 *
 * @param {Object} feature
 * @param {Object} options
 * @param {Boolean} simplify
 * @returns
 */
export const morphFeatureToPolygon = (feature, options = {}, simplify = true) => {
  let depth = 1;
  if (feature.geometry.type === 'MultiPolygon') {
    depth = 2;
  }
  let simplified = simplify ? simplifyFeature(feature) : feature;
  let coords = simplified.geometry.coordinates;
  let latlngs = L.GeoJSON.coordsToLatLngs(coords, depth);
  let result = new L.polygon(latlngs, {
    ...options,
    draggable: true,
    transform: true,
  });
  result.layerType = 'polygon';
  if (result.dragging) result.dragging.disable();
  return result;
};
