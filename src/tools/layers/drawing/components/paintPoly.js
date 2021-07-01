import React from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import circle from '@turf/circle';
import union from '@turf/union';
import difference from '@turf/difference';
import * as turf from '@turf/turf';

import {
  convertOptionsToProperties,
  getGeoJSONFeatureFromLayer,
  highlightStyles,
  normalStyles,
  simplifyFeature,
} from '../util/Poly';

import { STROKES } from '../util/constants';

const DEFAULT_COLOR = '#333333';
const DEFAULT_RADIUS = 30;
const ERASE_KEY = 'X';
const ERASER_COLOR = '#ee000055';

/**
 * @author Andrej Tlcina
 */
class PaintPoly {
  constructor(props) {
    this.tabState = props.tabState;
    // this._map = window.map;

    this._action = null;
    this._circle = null;
    this._mouseDown = false;
    this._latlng = [0, 0];

    this._maxCircleRadius = 100;
    this._minCircleRadius = 10;
    this._circleRadius = DEFAULT_RADIUS;

    this.keyIndex = 0;

    this._accumulatedShapes = {};
    this._shapeLayers = {};

    this._active = false;
  }

  /**
   * getter
   *
   * @returns {Boolean}
   */
  getMouseDown = () => {
    return this._mouseDown;
  };

  /**
   * getter
   *
   * @returns {Number}
   */
  getBrushSize = () => {
    return this._circleRadius;
  };

  /**
   * getter
   *
   * @returns {{ maxBrushSize: Number, minBrushSize: Number}}
   */
  getBrushSizeConstraints = () => {
    return { maxBrushSize: this._maxCircleRadius, minBrushSize: this._minCircleRadius };
  };

  /**
   * resizes brush size (changes circle radius)
   *
   * @param {Number} val
   */
  resizeBrush = (val) => {
    if (val && val <= this._maxCircleRadius && val >= this._minCircleRadius) {
      this._circleRadius = val;
      this._circle.setRadius(val);
    }
  };

  /**
   * stops brush tool, and removes circle object from mouse cursor
   */
  stop = () => {
    this._action = null;
    if (this._circle) {
      this._circle.remove();
    }
    this._removeMouseListener();
  };

  /**
   * creates circle around mouse cursor and applies event listeners
   */
  startPaint = () => {
    this.stop();
    this._action = 'draw';
    this._addMouseListener();
    this._circle = L.circleMarker(this._latlng, {
      color: DEFAULT_COLOR,
    })
      .setRadius(this._circleRadius)
      .addTo(window.map);
  };

  /**
   * creates circle around mouse cursor and applies event listeners
   */
  startErase = () => {
    this.stop();
    this._action = 'erase';
    this._addMouseListener();
    this._circle = L.circleMarker(this._latlng, {
      color: ERASER_COLOR,
    })
      .setRadius(this._circleRadius)
      .addTo(window.map);
  };

  /**
   * painted polygons change (with union, difference ops)
   * whenever one changes remove it, otherwise you'll start painting on the old one (not modified one)
   */
  clearPaintedPolys = (kIdx) => {
    if (kIdx === undefined) return;

    if (this._shapeLayers[kIdx]) {
      this._shapeLayers[kIdx].remove();
      delete this._shapeLayers[kIdx];
    }
    delete this._accumulatedShapes[kIdx];
  };

  /**
   * removes all accumulated circles (painted polygons)
   */
  clearAllAccumulated = () => {
    Object.keys(this._accumulatedShapes).forEach((key) => {
      delete this._accumulatedShapes[key];
    });
  };

  /**
   * updates painted polygons with passed layer
   *
   * @param {Number} kIdx
   * @param {Layer} layer
   * @returns
   */
  updatePaintedPolys = (kIdx, layer) => {
    if (kIdx === undefined) return;

    if (this._shapeLayers[kIdx]) {
      this._shapeLayers[kIdx] = layer;
    }
    let feature = layer.toGeoJSON();
    feature.properties = convertOptionsToProperties(layer.options);

    this._accumulatedShapes[kIdx] = feature;
  };

  /**
   * taken from https://stackoverflow.com/questions/27545098/leaflet-calculating-meters-per-pixel-at-zoom-level
   *
   * @returns {Number}
   */
  _pixelsToMeters = () => {
    const metersPerPixel =
      (40075016.686 * Math.abs(Math.cos((this._latlng.lat * Math.PI) / 180))) /
      Math.pow(2, window.map.getZoom() + 8);

    return this._circleRadius * metersPerPixel;
  };

  /**
   * creates circle and appends it to accumulated circles object
   *
   * @param {Boolean} erase
   */
  drawCircle = (erase) => {
    const brushColor = this.tabState.getSelectedColor() || DEFAULT_COLOR;
    const brushStroke = this.tabState.getSelectedStroke() || STROKES[1].value;
    const turfCircle = circle([this._latlng.lng, this._latlng.lat], this._pixelsToMeters(), {
      steps: 16,
      units: 'meters',
    });

    const kIdx = erase ? ERASE_KEY : this.keyIndex;

    if (!this._accumulatedShapes[kIdx]) {
      this._accumulatedShapes[kIdx] = turfCircle;
    } else {
      this._accumulatedShapes[kIdx] = union(this._accumulatedShapes[kIdx], turfCircle);
    }

    this._accumulatedShapes[kIdx].properties = { fill: brushColor, 'stroke-width': brushStroke };
    // console.log({
    //   accShapes: this._accumulatedShapes,
    //   shape: this._accumulatedShapes[kIdx],
    //   kIdx: kIdx,
    // });
    this._redrawShapes();
  };

  /**
   * got through all accumulated circles and out put them on the map
   */
  _redrawShapes = () => {
    const selectedLayer = this.tabState.getToolState().selectedLayer;
    Object.keys(this._accumulatedShapes).forEach((key) => {
      let simplified = simplifyFeature(this._accumulatedShapes[key]);
      let coords = simplified.geometry.coordinates;
      let isMultiPoly = this._accumulatedShapes[key].geometry.type === 'MultiPolygon';
      let depth = isMultiPoly ? 2 : 1;
      let latlngs = L.GeoJSON.coordsToLatLngs(coords, depth);
      let color = this._accumulatedShapes[key]?.properties?.fill || DEFAULT_COLOR;
      let weight = this._accumulatedShapes[key]?.properties['stroke-width'] || STROKES[1].value;

      let styles = selectedLayer?.kIdx === key ? highlightStyles : normalStyles;

      let opts =
        key === ERASE_KEY
          ? { color: ERASER_COLOR, draggable: false, transform: false }
          : {
              color,
              weight,
              draggable: true,
              transform: true,
            };

      let result = new L.polygon(latlngs, { ...opts, ...styles });

      result?.dragging?.disable();

      if (this._shapeLayers[key] !== undefined) {
        this._shapeLayers[key].remove();
      }

      this._shapeLayers[key] = result.addTo(window.map);
    });
  };

  /**
   * when fired brush stroke is appended to map
   * created object is passed to 'createdListener' function of tool
   */
  _fireCreatedShapes = () => {
    // console.log('%cfired', 'color: #085f89');
    const layerState = this.tabState.getToolState();
    Object.keys(this._shapeLayers).forEach((key) => {
      const found = layerState.getLayerByIdx(key);
      if (found) {
        layerState.removeLayer(found);
        this._shapeLayers[key].kIdx = key;
        this._shapeLayers[key].layerType = 'painted';
        layerState.addLayer(this._shapeLayers[key]);
      } else {
        window.map.fire(L.Draw.Event.CREATED, {
          layer: this._shapeLayers[key],
          layerType: key === ERASE_KEY ? 'erased' : 'painted',
          keyIndex: key,
        });
      }
    });
  };

  // ================= EVENT LISTENERS =================
  _addMouseListener = () => {
    window.map.on('mousemove', this._onMouseMove);
    window.map.on('mousedown', this._onMouseDown);
    window.map.on('mouseup', this._onMouseUp);
  };
  _removeMouseListener = () => {
    window.map.off('mousemove', this._onMouseMove);
    window.map.off('mousedown', this._onMouseDown);
    window.map.off('mouseup', this._onMouseUp);
  };
  _onMouseDown = (event) => {
    window.map.dragging.disable();
    this._mouseDown = true;
    this._onMouseMove(event);
  };
  _onMouseUp = (event) => {
    window.map.dragging.enable();
    this._mouseDown = false;
    this.keyIndex += 1;
    this._fireCreatedShapes();
  };
  _onMouseMove = (event) => {
    this._setLatLng(event.latlng);
    if (this._mouseDown) {
      this.drawCircle(this._action === 'erase');
    }
  };
  // ================= EVENT LISTENERS END =================

  /**
   * updates latlng so circle around mouse cursor follows it
   *
   * @param {Object} latlng
   */
  _setLatLng = (latlng) => {
    if (latlng !== undefined) {
      this._latlng = latlng;
    }
    if (this._circle) {
      this._circle.setLatLng(this._latlng);
    }
  };

  /**
   * button for painting is clicked
   *
   * @param {Object} event
   * @returns
   */
  clickDraw = (event) => {
    if (event.type == 'mousedown') {
      L.DomEvent.stop(event);
      return;
    }
    if (this._action == 'draw') {
      this.disable();
    } else {
      this.enablePaint();
    }
  };

  /**
   * button for erasing is clicked
   *
   * @param {Object} event
   * @returns
   */
  erase = (event) => {
    if (event.type == 'mousedown') {
      L.DomEvent.stop(event);
      return;
    }
    if (this._action == 'erase') {
      this.disable();
    } else {
      this.startErase();
      this._active = true;
    }
  };

  /**
   * enables erasing
   */
  enableErase = () => {
    this.startErase();
    this._active = true;
  };

  /**
   * enables painting
   */
  enablePaint = () => {
    this.startPaint();
    this._active = true;
  };

  /**
   * disables tool
   */
  disable = () => {
    this.stop();
    this._active = false;
  };

  /**
   * getter
   *
   * @returns {Boolean}
   */
  isActive = () => {
    return this._active;
  };
}

export default PaintPoly;
