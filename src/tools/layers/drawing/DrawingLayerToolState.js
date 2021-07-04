import { AbstractLayerToolState } from '../abstract';
import L from 'leaflet';
import {
  convertOptionsToProperties,
  convertPropertiesToOptions,
  getLeafletTypeFromFeature,
  isLayerPoly,
} from './util/Poly';
import { isEmpty, sortReverseAlpha } from './util/functionUtils';
import { FIRST, NOT_FOUND, iconStarter, normalStyles } from './util/constants';

const MAX_CHOSEN = 2;

/**
 * This class provide functions for using the state of the layer tool.
 *
 * @author Andrej Tlcina
 */
class DrawingLayerToolState extends AbstractLayerToolState {
  /**
   * It creates a tool state.
   */
  constructor(tool) {
    super();
    // * element/layer that was created
    this.currEl = null;

    this.featureGroup = new L.FeatureGroup();
    this.activeIndex = 0;
    // * for knowing if we are using select tool
    this.selecting = false;
    // * for knowing if we already selected layer
    this.selectedLayer = null;

    this.tool = tool;

    this.createdVertices = [];
    this.mappedMarkersToVertices = {};

    // * selected for join
    this.chosenLayers = [];

    // * selected for customization
    this.extraSelected = [];
  }

  /**
   * clears extraSelected array and sets normal styles to each geo. object
   */
  clearExtraSelected = () => {
    this.extraSelected.forEach((selected) => {
      this.tool.normalizeElement(selected);
    });
    this.extraSelected = [];
  };

  /**
   * checks if layer is in extraSelected objects
   *
   * @param {String} layerId
   * @returns {Number} -1 and greater
   */
  isInExtraSelected = (layerId) => {
    const found = this.extraSelected.map((el) => el._leaflet_id).indexOf(layerId);
    return found;
  };

  /**
   * checks if selected and passed object are of the same type
   *
   * @param {Layer} layer
   * @returns {Boolean}
   */
  areSameType = (layer) => {
    if (isLayerPoly(this.selectedLayer)) {
      return isLayerPoly(layer);
    }

    return this.selectedLayer.layerType === layer.layerType;
  };

  /**
   * add passed layer to array and highlights it
   *
   * @param {Layer} layer
   * @returns
   */
  addExtraSelected = (layer) => {
    // * have only one type of object in array
    if (!this.areSameType(layer)) return;

    const idx = this.isInExtraSelected(layer._leaflet_id);
    if (idx > -1) {
      this.tool.normalizeElement(layer);
      this.extraSelected.splice(idx, 1);
    } else {
      this.tool.highlightElement(layer);
      this.extraSelected.push(layer);
    }
  };

  /**
   * checks if maximum size of an array is reached
   */
  chosenLayersMaxed = () => {
    return this.chosenLayers.length === MAX_CHOSEN;
  };

  /**
   * pushes passed object into array, if length exceeds maximum array is shifted
   * so the lenght is constant
   *
   * @param {Layer} layer
   */
  pushChosenLayer = (layer) => {
    if (this.chosenLayers.length >= MAX_CHOSEN) {
      this.chosenLayers.shift();
    }
    this.tool.highlightElement(layer);
    this.chosenLayers.push(layer);
  };

  /**
   * deselects all selected ones
   */
  deselectChosenLayers = () => {
    this.chosenLayers.forEach((chosen) => this.tool.normalizeElement(chosen));
    this.chosenLayers = [];
  };

  /**
   * removes all selected ones
   */
  clearChosenLayers = () => {
    this.chosenLayers.forEach((chosen) => this.removeLayer(chosen));
    this.chosenLayers = [];
  };

  /**
   * layers are joined which means remove previous ones and append joined
   *
   * @param {Layer} joined
   */
  pushJoinedToChosenLayers = (joined) => {
    this.clearChosenLayers();
    this.tool.highlightElement(joined);
    this.chosenLayers.push(joined);
    this.addLayer(joined);
  };

  /**
   * checks if markers is connect marker
   *
   * @param {Layer} marker
   * @returns {Boolean}
   */
  isConnectMarker = (marker) => {
    return marker?.layerType === 'marker' && marker?.options?.icon?.options?.connectClick;
  };

  /**
   * checks if selected layer is connect marker
   *
   * @returns {boolean}
   */
  selectedLayerIsConnectMarker = () => {
    return this.isConnectMarker(this.selectedLayer);
  };

  /**
   * checks if geo. object may be push to an array and be joined later on
   *
   * @param {Layer} layer
   * @returns {Boolean}
   */
  canPushToChosen = (layer) => {
    const acceptableType = this.isConnectMarker(layer) || isLayerPoly(layer);
    if (isEmpty(this.chosenLayers)) {
      if (acceptableType) return true;
    } else {
      let firstChosen = this.chosenLayers[FIRST];
      if (this.isConnectMarker(firstChosen) && this.isConnectMarker(layer)) return true;
      if (isLayerPoly(firstChosen) && isLayerPoly(layer)) return true;
    }

    return false;
  };

  chosenLayersArePolys = () => {
    let firstChosen = this.chosenLayers[FIRST];
    return isLayerPoly(firstChosen);
  };

  /**
   * checks if layers, to be joined, are markers
   *
   * @returns boolean
   */
  chosenLayersAreMarkers = () => {
    let firstChosen = this.chosenLayers[FIRST];
    return this.isConnectMarker(firstChosen);
  };

  /**
   * Pushes vertice into created ones
   *
   * @param {Layer} vertice
   */
  pushVertice = (vertice) => {
    this.createdVertices.push(vertice);
  };

  /**
   * removes vertice based on given leaflet id
   *
   * @param {String} lId
   */
  removeGivenVertice = (lId) => {
    const idsOfVerticesToRemove = new Set([lId]);

    const result = this.removeMappedVertices(idsOfVerticesToRemove);

    const index = this.createdVertices.map((v) => v._leaflet_id).indexOf(lId);
    if (index !== NOT_FOUND) {
      this.createdVertices.splice(index, 1);
    }

    this.mappedMarkersToVertices = result;
  };

  /**
   * removes vertice which ids were passed
   *
   * @param {Set} idsOfVerticesToRemove
   * @returns {Object} mappedMarkersToVertices
   */
  removeMappedVertices = (idsOfVerticesToRemove) => {
    // * copy object
    const newMapped = { ...this.mappedMarkersToVertices };

    // *  go through each marker object, containing { [index]: vertice } pairs
    Object.values(newMapped).forEach((vertObj) => {
      // * now go through each index
      Object.keys(vertObj).forEach((key) => {
        let vert = vertObj[key];
        if (idsOfVerticesToRemove.has(vert._leaflet_id)) {
          this.removeLayer(vert);
          delete vertObj[key];
        }
      });
    });

    return newMapped;
  };

  /**
   * takes in leaflet id and removes vertices mapped to marker
   *
   * @param {String} lId
   */
  removeMarkersMappedVertices = (lId) => {
    const markerVertices = this.mappedMarkersToVertices[lId];

    const idsOfVerticesToRemove = new Set();
    // * save vertices' ids
    Object.values(markerVertices)?.forEach((v) => idsOfVerticesToRemove.add(v._leaflet_id));

    // * remove vertices
    const newMapped = this.removeMappedVertices(idsOfVerticesToRemove);

    // * marker no longer has vertices, so remove it
    delete newMapped[lId];

    this.mappedMarkersToVertices = newMapped;
  };

  /**
   * setter
   *
   * @param {Boolean} is
   */
  setSelecting(is) {
    this.selecting = is;
  }

  /**
   * getter
   *
   * @returns {Boolean}
   */
  getSelecting() {
    return this.selecting;
  }

  /**
   * add layer to featureGroup and it is displayed
   *
   * @param {Layer} layer
   * @returns
   */
  addLayer(layer) {
    this.featureGroup.addLayer(layer);
    this.tool.applyEventListeners(layer);
    return layer;
  }

  /**
   * removes layer from featureGroup and from map
   *
   * @param {Layer} layer
   */
  removeLayer(layer) {
    this.featureGroup.removeLayer(layer);
  }

  /**
   * removes selected layer
   *
   * @param {Layer} layer
   */
  removeSelectedLayer(layer) {
    this.featureGroup.removeLayer(layer || this.selectedLayer);
    this.selectedLayer = null;
  }

  /**
   * gets layer with kIdx that equals passed one
   *
   * @param {Number} idx
   * @returns {Layer}
   */
  getLayerByIdx(idx) {
    const found = Object.values(this.featureGroup._layers).find((l) => l.kIdx === idx);
    return found;
  }

  /**
   * removes layer with same kIdx as passed one
   *
   * @param {Number} idx
   * @returns
   */
  removeLayerByIdx(idx) {
    if (idx === undefined) return;
    const found = Object.values(this.featureGroup._layers).find((l) => l.kIdx === idx);
    if (found) this.removeLayer(found);
  }

  /**
   * sets selected layer and highlights it
   *
   * @param {Layer} layer
   */
  setSelectedLayer(layer) {
    this.tool.normalizeElement(this.selectedLayer);
    this.selectedLayer = layer;
    this.tool.highlightElement(layer);
    this.clearExtraSelected();
  }

  /**
   * removes selected layer
   */
  clearSelectedLayer() {
    this.selectedLayer = null;
  }

  /**
   * sets vertices to marker
   *
   * @param {String} lId
   * @param {Object} val
   */
  setVerticesToMarker(lId, val) {
    this.mappedMarkersToVertices[lId] = val;
  }

  /**
   * saving topology information to marker
   *
   * @param {Layer} layer
   * @param {Layer} result
   */
  addMappedVertices = (layer, result) => {
    let lId = layer._leaflet_id;
    let mappedVertices = this.mappedMarkersToVertices[lId];
    let mappedProperty = {};
    Object.keys(mappedVertices).forEach((key) => {
      mappedProperty[key] = mappedVertices[key]._leaflet_id;
    });
    if (!isEmpty(mappedProperty)) result.mappedVertices = mappedProperty;
  };

  /**
   * called so when we import topology dragging of vertices works
   *
   * @param {*} lType
   * @param {*} result
   * @param {*} source
   */
  initMappedMarkersToVertices = (lType, result, source) => {
    if (lType === 'marker' && source.mappedVertices) {
      this.mappedMarkersToVertices[result._leaflet_id] = source.mappedVertices;
    }
    if (lType === 'polyline' || lType === 'vertice') {
      // * keys are marker leaflet ids
      Object.keys(this.mappedMarkersToVertices).forEach((markerId) => {
        // * values are index of vertice
        let verticesKeyArr = Object.keys(this.mappedMarkersToVertices[markerId]);
        // * leaflet id of vertice
        let vertLeafId = source.mappedVerticeId;
        let verticesObj = this.mappedMarkersToVertices[markerId];
        verticesKeyArr.forEach((vertKey) => {
          if (verticesObj[vertKey] === vertLeafId) {
            let spreadable = this.mappedMarkersToVertices[markerId] || {};
            this.mappedMarkersToVertices[markerId] = {
              ...spreadable,
              [vertKey]: result,
            };
          }
        });
      });
    }
  };

  /**
   * serializes map state to GeoJSON
   *
   * @returns {Object}
   */
  serializeToGeoJSON() {
    const geo = {
      type: 'FeatureCollection',
      features: [],
    };

    this.featureGroup.eachLayer((l) => {
      let feature = l.toGeoJSON();

      let properties = convertOptionsToProperties(l.options);
      feature.properties = properties;

      if (l.popupContent) feature.properties.popupContent = l.popupContent;
      if (l.identifier) feature.id = l.identifier;

      let iconOptions = l?.options?.icon?.options;
      if (iconOptions) feature.properties.iconOptions = iconOptions;

      if (this.isConnectMarker(l)) {
        this.addMappedVertices(l, feature.properties);
      }
      if (l.layerType === 'vertice') feature.properties.mappedVerticeId = l._leaflet_id;

      geo.features.push(feature);
    });

    return geo;
  }

  /**
   * deserializes GeoJSON to map state
   *
   * @param {Object} geojson
   * @returns
   */
  deserializeGeoJSON(geojson) {
    const sidebarState = this.tool.getSidebarTabControl().getState();
    // console.log({ geojson });
    if (geojson.type === 'FeatureCollection' && geojson.features) {
      geojson.features
        .sort((a, b) => sortReverseAlpha(a.geometry.type, b.geometry.type))
        .forEach((f) => {
          let opts = convertPropertiesToOptions(f.properties);
          let lType = getLeafletTypeFromFeature(f);
          let latlng = L.GeoJSON.coordsToLatLngs(f.geometry.coordinates, 1);
          let result;
          if (lType === 'polygon') {
            result = new L.polygon(latlng, opts);
          } else if (lType === 'polyline') {
            result = new L.polyline(latlng, opts);
          } else if (lType === 'marker') {
            let spreadable = f?.properties?.iconOptions || {};
            if (spreadable.iconUrl) sidebarState.appendToIconSrcs(spreadable.iconUrl);
            let options = {
              ...iconStarter,
              iconUrl: sidebarState.getSelectedIcon(),
              ...spreadable,
            };

            let icon = new L.Icon(options);
            result = new L.Marker.Touch(latlng, { icon });
          }
          if (result) {
            result.layerType = lType;

            // result.snapediting = new L.Handler.MarkerSnap(map, result);
            // result.snapediting.enable();
            this.tool.tabControl.state.pushGuideLayer(result);

            if (f?.properties?.popupContent) {
              result.popupContent = f.properties.popupContent;
              result.bindPopup(f.properties.popupContent, {
                closeOnClick: false,
                autoClose: false,
              });
            }
            if (f.id) {
              result.identifier = f.id;
            }
            if (result.dragging) result.dragging.disable();
            this.addLayer(result);
          }
          this.initMappedMarkersToVertices(lType, result, f.properties);
        });
    }

    return;
  }

  /**
   * serializes map state to internal JSON representation
   *
   * @param {Object} defaults
   * @returns
   */
  serialize(defaults) {
    let config = super.serialize(defaults);

    const exportSettings = [];

    const pushPolygon = (layer, layerType, extra = {}) => {
      const { options, _latlngs: latlngs, popupContent = '' } = layer;
      exportSettings.push({
        layerType,
        options: { ...options, ...normalStyles, draggable: true, transform: true },
        latlngs,
        popupContent,
        ...extra,
      });
    };

    const pushMarker = (layer, layerType) => {
      const { popupContent = '' } = layer;
      let extra = {};
      if (this.isConnectMarker(layer)) {
        this.addMappedVertices(layer, extra);
      }
      exportSettings.push({
        layerType,
        options: { ...layer?.options?.icon?.options, draggable: true, transform: true },
        latlngs: layer._latlng,
        popupContent,
        ...extra,
      });
    };

    this.featureGroup.eachLayer((layer) => {
      const { layerType } = layer;
      if (layerType === 'marker') {
        pushMarker(layer, layerType);
      } else {
        if (layer._layers) {
          layer.eachLayer((l) => {
            pushPolygon(l, layerType);
          });
        } else {
          let extra = layerType === 'vertice' ? { mappedVerticeId: layer._leaflet_id } : {};
          pushPolygon(layer, layerType, extra);
        }
      }
    });

    config.data = exportSettings;
    return config;
  }

  /**
   * deserializes internal JSON representation to map state
   *
   * @param {Object} config
   */
  deserialize(config) {
    super.deserialize(config);

    const sidebarState = this.tool.getSidebarTabControl().getState();

    const { data = [] } = config;

    data.forEach((layer) => {
      let layerToAdd;
      // decide what type they are according to it render what is needed
      if (layer.layerType === 'marker') {
        let { latlngs } = layer;
        let latlng = L.latLng(latlngs.lat, latlngs.lng);
        if (layer?.options?.iconUrl) sidebarState.appendToIconSrcs(layer.options.iconUrl);
        let options = {
          ...layer.options,
          iconAnchor: new L.Point(layer.options.iconAnchor.x, layer.options.iconAnchor.y),
          iconSize: new L.Point(layer.options.iconSize.x, layer.options.iconSize.y),
        };
        let MyCustomMarker = L.Icon.extend({
          options,
        });

        let icon = new MyCustomMarker();
        icon.options = options;
        let marker = new L.Marker.Touch(latlng, { icon });

        layerToAdd = marker;
      } else {
        let _latlng;
        let poly;
        if (layer.layerType === 'polyline' || layer.layerType === 'vertice') {
          _latlng = layer.latlngs.map((l) => L.latLng(l.lat, l.lng));
          poly = new L.polyline(_latlng, layer.options);
        }
        if (layer.layerType === 'polygon' || layer.layerType === 'painted') {
          _latlng = layer.latlngs[0].map((l) => L.latLng(l.lat, l.lng));
          poly = new L.polygon(_latlng, layer.options);
        }

        layerToAdd = poly;
      }

      if (layer.popupContent) {
        layerToAdd.bindPopup(layer.popupContent, { closeOnClick: false, autoClose: false });
        layerToAdd.popupContent = layer.popupContent;
      }
      // layer.snapediting = new L.Handler.MarkerSnap(map, layer);
      // layer.snapediting.enable();
      this.tool.tabControl.state.pushGuideLayer(layer);

      layerToAdd.layerType = layer.layerType;
      if (layerToAdd.dragging) layerToAdd.dragging.disable();
      this.addLayer(layerToAdd);
      this.initMappedMarkersToVertices(layer.layerType, layerToAdd, layer);
    });
  }
}
export default DrawingLayerToolState;
