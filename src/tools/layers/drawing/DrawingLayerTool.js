import L from 'leaflet';
import AbstractLayerTool from '../abstract/AbstractLayerTool';
import DrawingLayerToolState from './DrawingLayerToolState';
import DrawingLayerToolDefaults from './DrawingLayerToolDefaults';
import DrawingLayerToolTabControl from './sidebar/DrawingLayerToolTabControl';
import useDrawingToolbar from './components/useDrawingToolbar';

import 'leaflet/dist/leaflet.css';
import './style/drawingLayer.scss';
import 'leaflet-snap';
import 'leaflet-geometryutil';
import 'leaflet-draw';

import * as d33 from 'd3-3-5-5';
import { SPACE_BAR, highlightStyles, normalStyles } from './util/constants';

import LineTool from './tools/LineTool';
import MarkerTool from './tools/MarkerTool';
import PolygonTool from './tools/PolygonTool';
import SearchTool from './tools/SearchTool';
import TopologyTool from './tools/TopologyTool';
import FreehandSliceTool from './tools/FreehandSliceTool';
import GeometricSliceTool from './tools/GeometricSliceTool';
import PaintTool from './tools/PaintTool';
import EraseTool from './tools/EraseTool';
import JoinTool from './tools/JoinTool';
import DeselectTool from './tools/DeselectTool';
import TransformTool from './tools/TransformTool';
import EditTool from './tools/EditTool';
import RemoveTool from './tools/RemoveTool';
import { polyDiff, polyIntersect, polyJoin } from './rules';

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

    tools[JoinTool.NAME()] = new JoinTool({ drawingTool: this });

    tools[DeselectTool.NAME()] = new DeselectTool({ drawingTool: this });
    tools[TransformTool.NAME()] = new TransformTool({ drawingTool: this });
    tools[EditTool.NAME()] = new EditTool({ drawingTool: this });
    tools[RemoveTool.NAME()] = new RemoveTool({ drawingTool: this });

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
      DeselectTool.deselect(selected, this);
      TransformTool.initTransform(selected, true);
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
   * @brief called whenever new geo. object is created
   *
   * @param {Object} e
   */
  createdListener = (e) => {
    let layer = e.layer;
    if (!layer) return;

    layer.layerType = e.layerType;
    const sidebarState = this.getSidebarTabControl().getState();
    const state = this.getState();

    const { intersectActivated } = sidebarState;

    if (e.layerType === 'polygon' || e.layerType === 'painted') {
      // * JOIN
      if (intersectActivated) layer = polyIntersect(layer, e.keyIndex, state);
      else layer = polyJoin(layer, e.keyIndex, state);
    }

    if (e.layerType === 'polygon' || e.layerType === 'painted' || e.layerType === 'erased') {
      // * DIFFERENCE
      polyDiff(layer, state, intersectActivated);
    }

    if (layer?.dragging) layer.dragging.disable();

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
    }

    // * MARKER
    if (this.getState().isConnectMarker(layer)) {
      this.drawingTools[TopologyTool.NAME()].plotTopology();
    }
  };

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
   * @brief event listener so vetice is dragged with marker
   *
   * @param {Layers} layer
   */
  applyTopologyMarkerListeners(layer) {
    layer.on('drag', (event) => {
      const { latlng, oldLatLng, target } = event;
      const markerVertices = this.state.mappedMarkersToVertices[target._leaflet_id];

      // console.log({ lat: latlng.lat, lng: latlng.lng, oldlat: oldLatLng.lat, oldlng: oldLatLng.lng });

      TopologyTool.changeVerticesLocation(latlng, markerVertices);
    });
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
      const joinTool = this.drawingTools[JoinTool.NAME()];
      joinTool.joinChosen(drawObject);
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
      }
    });
    state.setSelectedLayer(drawObject);
    TransformTool.initTransform(drawObject);
    this.redrawSidebarTabControl(drawObject.layerType);

    this.tabControl.state.callIdentifierChange(true);

    document.querySelector('.leaflet-container').style.cursor = '';
    // * at this point user clicked without holdin 'CTRL' key
    // state.clearExtraSelected();
  };
}

export default DrawingLayerTool;
