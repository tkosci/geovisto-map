import L from 'leaflet';
import AbstractLayerTool from '../abstract/AbstractLayerTool';
import DrawingLayerToolState from './DrawingLayerToolState';
import DrawingLayerToolDefaults from './DrawingLayerToolDefaults';
import DrawingLayerToolTabControl from './sidebar/DrawingLayerToolTabControl';
import useDrawingToolbar from './components/useDrawingToolbar';
import union from '@turf/union';
import {
  convertOptionsToProperties,
  convertPropertiesToOptions,
  featureToLeafletCoordinates,
  getGeoJSONFeatureFromLayer,
  getLeafletTypeFromFeature,
  highlightStyles,
  normalStyles,
  getFeatFromLayer,
  isFeaturePoly,
  isLayerPoly,
  simplifyFeature,
  morphFeatureToPolygon,
} from './util/Poly';

import 'leaflet/dist/leaflet.css';
import './style/drawingLayer.scss';
import difference from '@turf/difference';
import MapCreatedEvent from '../../../model/event/basic/MapCreatedEvent';
import { iconStarter } from './util/Marker';
import { filter } from 'd3-array';
import lineToPolygon from '@turf/line-to-polygon';
import * as turf from '@turf/turf';
import * as martinez from 'martinez-polygon-clipping';
import * as polyClipping from 'polygon-clipping';
import 'leaflet-snap';
import 'leaflet-geometryutil';
import 'leaflet-draw';

import * as d33 from 'd3-3-5-5';
import Pather from 'leaflet-pather';
import { isEmpty, sortReverseAlpha, sortAlpha } from './util/functionUtils';
import { FIRST, NOT_FOUND, SPACE_BAR } from './util/constants';
import { getCoords } from '@turf/turf';
import LineTool from './tools/LineTool';
import MarkerTool from './tools/MarkerTool';
import PolygonTool from './tools/PolygonTool';
import SearchTool from './tools/SearchTool';
import TopologyTool from './tools/TopologyTool';
import FreehandSliceTool from './tools/FreehandSliceTool';
import GeometricSliceTool from './tools/GeometricSliceTool';
import PaintTool from './tools/PaintTool';
import EraseTool from './tools/EraseTool';

// ! pather throws errors without this line
window.d3 = d33;

// * as advised in https://github.com/makinacorpus/Leaflet.Snap/issues/52
L.Draw.Feature.include(L.Evented.prototype);
L.Draw.Feature.include(L.Draw.Feature.SnapMixin);
L.Draw.Feature.addInitHook(L.Draw.Feature.SnapMixin._snap_initialize);

export const DRAWING_TOOL_LAYER_TYPE = 'geovisto-tool-layer-drawing';

/**
 * This class represents Drawing layer tool.
 *
 * @author Andrej Tlcina
 */
class DrawingLayerTool extends AbstractLayerTool {
  /**
   * It creates a new tool with respect to the props.
   *
   * @param {*} props
   */
  constructor(props) {
    super(props);
  }

  /**
   * A unique string of the tool type.
   */
  static TYPE() {
    return DRAWING_TOOL_LAYER_TYPE;
  }

  /**
   * It creates a copy of the uninitialized tool.
   */
  copy() {
    return new DrawingLayerTool(this.getProps());
  }

  /**
   * It creates new defaults of the tool.
   */
  createDefaults() {
    return new DrawingLayerToolDefaults();
  }

  /**
   * It returns default tool state.
   */
  createState() {
    return new DrawingLayerToolState(this);
  }

  /**
   * It returns a tab control.
   */
  getSidebarTabControl() {
    if (this.tabControl == undefined) {
      this.tabControl = this.createSidebarTabControl();
    }
    return this.tabControl;
  }

  redrawSidebarTabControl(layerType, enabled = false) {
    if (this.tabControl == undefined) return;
    this.tabControl.redrawTabContent(layerType, enabled);
  }

  /**
   * It creates new tab control.
   */
  createSidebarTabControl() {
    return new DrawingLayerToolTabControl({ tool: this });
  }

  /**
   * @brief redraws sidebar with search fields
   */
  search() {
    this.redrawSidebarTabControl('search');
  }

  /**
   * @brief aplies event listeners for each geo. object
   *
   * @param {Layer} layer
   */
  applyEventListeners(layer) {
    layer.on('click', L.DomEvent.stopPropagation).on('click', this.initChangeStyle, this);
    layer.on('mouseover', this.hightlightOnHover, this);
    layer.on('mouseout', this.normalizeOnHover, this);
    if (layer.layerType === 'marker') this.applyTopologyMarkerListeners(layer);
  }

  /**
   * @brief takes currently created polygon and loops through each polygon
   *        and executes operation 'difference'
   *
   * @param {Layer} layer
   * @param {Boolean} intersect
   */
  polyDiff(layer, intersect = false) {
    let selectedLayer = this.getState().selectedLayer;
    let paintPoly = this.getSidebarTabControl().getState().paintPoly;
    let fgLayers = this.getState().featureGroup._layers;

    let layerFeature = getGeoJSONFeatureFromLayer(layer);
    let isCurrentLayerPoly = isLayerPoly(layer);

    // let createdIsNotEraser = layer.layerType !== 'erased';
    let createdIsEraser = layer.layerType === 'erased';

    const replaceLayer = (replacement, replacedLayer, replacementCoords) => {
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
      this.getState().addLayer(replacement);
      this.getState().removeLayer(replacedLayer);
      paintPoly.clearPaintedPolys(replacedLayer.kIdx);
    };

    const diffLayers = (l) => {
      if (!l) return;
      let feature = getGeoJSONFeatureFromLayer(l);

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
              replaceLayer(result, l);
            } else {
              coords.forEach((coord) => {
                latlngs = L.GeoJSON.coordsToLatLngs([coord], depth);
                let result = new L.polygon(latlngs, {
                  ...l.options,
                });
                let newLatLngs = depth === 1 ? result._latlngs : result._latlngs[FIRST];
                replaceLayer(result, l, newLatLngs);
              });
            }
          } catch (error) {
            console.error({ coords, latlngs, error, depth });
          }
        } else {
          this.getState().removeLayer(l);
          paintPoly.clearPaintedPolys(l.kIdx);
        }
      }
    };

    if (isCurrentLayerPoly) {
      // * if intersect is active execute difference with only selected polygon
      if (intersect && !createdIsEraser) {
        diffLayers(selectedLayer, true);
      } else {
        Object.values(fgLayers)
          .filter((l) => isLayerPoly(l))
          .forEach((l) => {
            diffLayers(l);
          });
      }
    }
  }

  /**
   * @brief - takes selected object and currently created object
   *        and executes passed operation
   *        - used for union and intersection
   *
   * @param {Layer} layer
   * @param {Number | undefined} eKeyIndex
   * @param {Function} operation
   * @param {Boolean} selectNew
   * @returns {Layer} geo. object
   */
  operateOnSelectedAndCurrectLayer = (layer, eKeyIndex, operation, selectNew = false) => {
    let paintPoly = this.getSidebarTabControl().getState().paintPoly;

    let feature = getFeatFromLayer(layer);
    // * gets only first one because MultiPolygon is not expected to be created
    feature = Array.isArray(feature) ? feature[0] : feature;
    let isFeatPoly = isFeaturePoly(feature);
    if (!isFeatPoly) return layer;

    let summedFeature = feature;

    let selectedLayer = this.getState().selectedLayer;
    // * this can be multipolygon whenever user joins 2 unconnected polygons
    let selectedFeatures = getFeatFromLayer(selectedLayer);
    if (!selectedFeatures) return layer;

    // * selected feature may be multiple polygons so we sum them
    selectedFeatures.forEach((selectedFeature) => {
      let isSelectedFeaturePoly = isFeaturePoly(selectedFeature);

      if (isSelectedFeaturePoly) {
        summedFeature = operation(selectedFeature, summedFeature);
      }
    });

    layer = morphFeatureToPolygon(summedFeature, layer.options, false);
    paintPoly.clearPaintedPolys(eKeyIndex);
    if (selectNew) {
      this.getState().removeSelectedLayer();
      this.getState().setSelectedLayer(layer);
    }
    return layer;
  };

  /**
   * @brief intersect selected object with the one being currently created
   *
   * @param {Layer} layer
   * @param {Number | undefined} eKeyIndex
   * @returns
   */
  polyIntersect(layer, eKeyIndex) {
    const updatedLayer = this.operateOnSelectedAndCurrectLayer(layer, eKeyIndex, turf.intersect);

    return updatedLayer;
  }

  /**
   * @brief unifies selected object with the one being currently created
   *
   * @param {Layer} layer
   * @param {Number | undefined} eKeyIndex
   * @returns
   */
  polyJoin(layer, eKeyIndex) {
    const updatedLayer = this.operateOnSelectedAndCurrectLayer(layer, eKeyIndex, union, true);
    return updatedLayer;
  }

  /**
   * @brief called on drag to change vertice's point location
   *
   * @param {Object} latlng
   * @param {String} markerID
   * @returns
   */
  changeVerticesLocation(latlng, markerID) {
    const markerVertices = this.state.mappedMarkersToVertices[markerID];
    if (!markerVertices) return;

    this.setVerticesCoordinates(markerVertices, latlng);
  }

  /**
   * @brief takes in mapped vertices and markes and depending on index from key, new latlng is set to vertice
   *
   * @param {Object} markerVertices
   * @param {Object} latlng
   */
  setVerticesCoordinates(markerVertices, latlng) {
    Object.keys(markerVertices).forEach((key) => {
      let vertice = markerVertices[key];
      let splitKey = key?.split('-');
      let idx = splitKey ? splitKey[1] : undefined;
      if (idx === undefined) return;
      let latLngs = L.LatLngUtil.cloneLatLngs(vertice.getLatLngs());
      latLngs[idx] = latlng;
      vertice.setLatLngs(latLngs);
    });
  }

  /**
   * @brief called whenever new geo. object is created
   *
   * @param {Object} e
   */
  createdListener = (e) => {
    let layer = e.layer;
    layer.layerType = e.layerType;
    if (e.keyIndex) layer.kIdx = e.keyIndex;
    const sidebarState = this.getSidebarTabControl().getState();

    const { intersectActivated } = sidebarState;

    if (e.layerType === 'polygon' || e.layerType === 'painted') {
      // * JOIN
      if (intersectActivated) layer = this.polyIntersect(layer, e.keyIndex);
      else layer = this.polyJoin(layer, e.keyIndex);
    }

    if (e.layerType === 'polygon' || e.layerType === 'painted' || e.layerType === 'erased') {
      // * DIFFERENCE
      this.polyDiff(layer, intersectActivated);
    }

    if (layer.dragging) layer.dragging.disable();

    // * SLICE
    if (e.layerType === 'knife') {
      this.drawingTools[GeometricSliceTool.NAME()].polySlice(layer);
      // * restore state
      let enabled = sidebarState.getEnabledEl();
      if (enabled) {
        sidebarState.setEnabledEl(null);
        this.redrawSidebarTabControl();
      }
      const divideBtn = document.querySelector('.drawingtoolbar .divideBtn .extra-btn');
      if (divideBtn) divideBtn.classList.add('hide');
    }

    if (e.layerType !== 'knife' && e.layerType !== 'erased') {
      this.getState().addLayer(layer);
      sidebarState.pushGuideLayer(layer);
    }

    if (e.layerType === 'erased') {
      const map = this.getMap().getState().getLeafletMap();
      map.removeLayer(layer);
      let paintPoly = sidebarState.paintPoly;
      paintPoly.clearPaintedPolys(e.keyIndex);
    }

    // * MARKER
    if (this.getState().isConnectMarker(layer)) {
      this.drawingTools[TopologyTool.NAME()].plotTopology();
    }
  };

  /**
   * @brief event listener so vetice is dragged with marker
   *
   * @param {Layers} layer
   */
  applyTopologyMarkerListeners(layer) {
    layer.on('drag', (event) => {
      const { latlng, oldLatLng, target } = event;

      // console.log({ lat: latlng.lat, lng: latlng.lng, oldlat: oldLatLng.lat, oldlng: oldLatLng.lng });

      this.changeVerticesLocation(latlng, oldLatLng, target._leaflet_id);
    });
  }

  initializeDrawingTools() {
    const tools = {};

    tools[LineTool.NAME()] = new LineTool({ drawingTool: this });
    tools[MarkerTool.NAME()] = new MarkerTool({ drawingTool: this });
    tools[PolygonTool.NAME()] = new PolygonTool({ drawingTool: this });

    tools[SearchTool.NAME()] = new SearchTool({ drawingTool: this });
    tools[TopologyTool.NAME()] = new TopologyTool({ drawingTool: this });

    tools[GeometricSliceTool.NAME()] = new GeometricSliceTool({ drawingTool: this });
    tools[FreehandSliceTool.NAME()] = new FreehandSliceTool({ drawingTool: this });

    tools[PaintTool.NAME()] = new PaintTool({ drawingTool: this });
    tools[EraseTool.NAME()] = new EraseTool({ drawingTool: this });

    this.drawingTools = tools;
  }

  /**
   * It creates layer items.
   */
  createLayerItems() {
    console.log('%c ...creating', 'color: #ff5108');
    const map = this.getMap().getState().getLeafletMap();

    this.initializeDrawingTools();
    useDrawingToolbar();

    this.setGlobalSimplificationTolerance();

    map.addControl(L.control.drawingToolbar({ tool: this }));
    // * eventlistener for when object is created
    map.on('draw:created', this.createdListener);

    map.on('zoomend', () => this.setGlobalSimplificationTolerance());

    map.on('click', () => {
      const sidebar = this.getSidebarTabControl();
      if (Boolean(sidebar.getState().enabledEl)) return;
      if (document.querySelector('.leaflet-container').style.cursor === 'wait') return;
      let selected = this.getState().selectedLayer;
      if (selected) {
        this.normalizeElement(selected);
        this.initNodeEdit(true);
        this.redrawSidebarTabControl();
        this.initTransform(selected, true);
        this.getState().clearSelectedLayer();
        document.querySelector('.leaflet-container').style.cursor = '';
      }
      this.getState().clearExtraSelected();
    });

    document.addEventListener('keydown', (e) => {
      if (e.keyCode === SPACE_BAR) {
        let enabledEl = this.getSidebarTabControl().getState().enabledEl;
        if (enabledEl) {
          enabledEl.disable();
          // map.dragging.enable(); // we do not have to do this, it is already on always
        }
      }
    });
    document.addEventListener('keyup', (e) => {
      if (e.keyCode === SPACE_BAR) {
        let enabledEl = this.getSidebarTabControl().getState().enabledEl;
        if (enabledEl) {
          enabledEl.enable();
          // map.dragging.disable(); // we do not have to do this, it is already on always
        }
      }
    });

    const { pather } = this.getSidebarTabControl().getState();
    pather.on('created', this.drawingTools[FreehandSliceTool.NAME()].createdPath);

    const { featureGroup } = this.getState();
    featureGroup.eachLayer((layer) => {
      layer.addTo(map);
      this.applyEventListeners(layer);
    });
    return [featureGroup];
  }

  /**
   * @brief sets global tolerance for brush stroke
   */
  setGlobalSimplificationTolerance() {
    const map = window.map;
    const metersPerPixel =
      (40075016.686 * Math.abs(Math.cos((map.getCenter().lat * Math.PI) / 180))) /
      Math.pow(2, map.getZoom() + 8);
    const zoom = map.getZoom();

    // ! this is tried out, so no real calculation
    window.customTolerance = zoom >= 4 ? 0.0001 * metersPerPixel : 1.5;
  }

  /**
   * @brief highlights element
   *
   * @param {Object} el
   */
  highlightElement(el) {
    if (el?._icon) {
      L.DomUtil.addClass(el._icon, 'highlight-marker');
    } else {
      if (el?.setStyle) el.setStyle(highlightStyles);
    }
  }

  /**
   * @brief highlights element on mouse hover
   *
   * @param {Object} e
   * @returns
   */
  hightlightOnHover(e) {
    if (!this.getState().getSelecting()) return;
    this.highlightElement(e.target);
  }

  /**
   * @brief sets normal styles for element
   *
   * @param {Object} el
   */
  normalizeElement(el) {
    if (el?._icon) {
      L.DomUtil.removeClass(el._icon, 'highlight-marker');
    } else {
      if (el?.setStyle) el.setStyle(normalStyles);
    }
  }

  /**
   * @brief sets normal styles for element on mouse hover
   *
   * @param {Object} el
   */
  normalizeOnHover(e) {
    if (!this.getState().getSelecting()) return;
    const { chosenLayers } = this.getState();
    const isChosen = chosenLayers.map((x) => x._leaflet_id).includes(e.target._leaflet_id);
    if (isChosen) return;
    this.normalizeElement(e.target);
  }

  /**
   * @brief unifies all the features in array
   *
   * @param {Array<Layer>} features
   * @returns
   */
  getSummedFeature = (features) => {
    if (!features || !Array.isArray(features)) return null;

    let summedFeature = features[0];
    for (let index = 1; index < features.length; index++) {
      const feature = features[index];
      let isfeaturePoly = isFeaturePoly(feature);

      if (isfeaturePoly) {
        summedFeature = union(feature, summedFeature);
      }
    }

    return summedFeature;
  };

  /**
   * @brief joins two selected objects, either two polygons or two markers
   *
   * @param {Layer} drawObject
   * @returns
   */
  joinChosen = (drawObject) => {
    const layerState = this.getState();
    const unfit = !layerState.canPushToChosen(drawObject);
    if (unfit) return;
    layerState.pushChosenLayer(drawObject);
    // * if true that means user selected second geo. object of the same correct type
    if (layerState.chosenLayersMaxed()) {
      // * if all polys unify them
      if (layerState.chosenLayersArePolys()) {
        const { chosenLayers } = layerState;
        const chosenFeatures = chosenLayers
          .filter((c) => isLayerPoly(c))
          .map((chosen) => getFeatFromLayer(chosen));

        if (chosenFeatures.length !== chosenLayers.length) return;

        const first = this.getSummedFeature(chosenFeatures[0]);
        const second = this.getSummedFeature(chosenFeatures[1]);

        const resultFeature = union(first, second);
        const opts = { ...chosenLayers[0].options, ...chosenLayers[1].options };
        const result = morphFeatureToPolygon(resultFeature, opts, false);
        layerState.pushJoinedToChosenLayers(result);

        this.redrawSidebarTabControl(drawObject.layerType);
      }
      // *  if all markers plot topology
      if (layerState.chosenLayersAreMarkers()) {
        const { chosenLayers } = layerState;

        this.plotTopology(chosenLayers);

        layerState.deselectChosenLayers();
        layerState.clearChosenLayers();

        this.redrawSidebarTabControl(null);
      }
    }
  };

  /**
   * @brief called on object click to change its style accordingly
   *
   * @param {Object} e
   * @returns
   */
  initChangeStyle = (e) => {
    const drawObject = e.target;
    const state = this.getState();

    const selecting = state.getSelecting();
    if (selecting) {
      this.joinChosen(drawObject);
      return;
    }

    if (e?.originalEvent?.ctrlKey && state.selectedLayer) {
      state.addExtraSelected(drawObject);
      return;
    }

    let fgLayers = state.featureGroup._layers;
    Object.values(fgLayers).forEach((_) => {
      this.normalizeElement(_);
      _?.dragging?.disable();
      if (_?.transform?._enabled) {
        _.transform.disable();
        let paintPoly = this.getSidebarTabControl().getState().paintPoly;
        paintPoly.updatePaintedPolys(_.kIdx, _);
      }
    });
    state.setSelectedLayer(drawObject);
    this.initTransform(drawObject);
    this.redrawSidebarTabControl(drawObject.layerType);

    this.tabControl.state.callIdentifierChange(true);

    document.querySelector('.leaflet-container').style.cursor = '';
    // * at this point user clicked without holdin 'CTRL' key
    // state.clearExtraSelected();
  };

  /**
   * @brief makes geo. object able to tranform  (move, scale, rotate)
   *
   * @param {Layer} drawObject
   * @param {Boolean} disable
   */
  initTransform(drawObject, disable = false) {
    const layer = drawObject;
    if (layer?.transform) {
      if (layer.transform._enabled || disable) {
        layer.transform.disable();
        layer.dragging.disable();
        let paintPoly = this.getSidebarTabControl().getState().paintPoly;
        paintPoly.updatePaintedPolys(layer.kIdx, layer);
      } else {
        layer.transform.enable({ rotation: true, scaling: true });
        layer.dragging.enable();
      }
    } else if (layer.layerType === 'marker') {
      if (layer.dragging._enabled || disable) {
        layer.dragging.disable();
      } else {
        layer.dragging.enable();
      }
    }
  }

  /**
   * @brief makes edit nodes appear on object
   *
   * @param {Boolean} disable
   */
  initNodeEdit(disable = false) {
    const selectedLayer = this.getState().selectedLayer;

    if (selectedLayer?.editing) {
      if (selectedLayer.editing._enabled || disable) {
        selectedLayer.editing.disable();
        // let paintPoly = this.options.tool.getSidebarTabControl().getState().paintPoly;
        // paintPoly.updatePaintedPolys(layer.kIdx, layer);
      } else {
        selectedLayer.editing.enable();
      }
    }
  }

  /**
   * @brief removes a geo. object if selected
   */
  removeElement() {
    const selectedLayer = this.getState().selectedLayer;
    // * if marker is being removed, remove its vertices if any
    if (this.getState().selectedLayerIsConnectMarker()) {
      this.getState().removeMarkersMappedVertices(selectedLayer._leaflet_id);
    }
    if (selectedLayer.layerType === 'vertice') {
      this.getState().removeGivenVertice(selectedLayer._leaflet_id);
    }
    let paintPoly = this.getSidebarTabControl().getState().paintPoly;
    paintPoly.clearPaintedPolys(selectedLayer.kIdx);
    this.getState().removeSelectedLayer();
    this.redrawSidebarTabControl(null);
  }

  /**
   * @brief called when user wants to join multiple geo. objects
   */
  initSelecting = () => {
    const selecting = this.getState().getSelecting();
    this.getState().setSelecting(!selecting);
    if (!selecting) document.querySelector('.leaflet-container').style.cursor = 'crosshair';
    else document.querySelector('.leaflet-container').style.cursor = '';
  };

  /**
   * This function is called when layer items are rendered.
   */
  postCreateLayerItems() {}

  /**
   * It reloads data and redraw the layer.
   */
  redraw(onlyStyle) {
    console.log('%c ...redrawing', 'color: #08ff51');
  }

  /**
   * This function is called when a custom event is invoked.
   *
   * @param {AbstractEvent} event
   */
  handleEvent(event) {}
}

export default DrawingLayerTool;
