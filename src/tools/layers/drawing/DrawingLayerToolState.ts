import { AbstractLayerToolState } from "../abstract";
import L, { FeatureGroup, Polyline } from "leaflet";
import {
  convertCoords,
  convertOptionsToProperties,
  convertPropertiesToOptions,
  getConversionDepth,
  getLeafletTypeFromFeature,
  isLayerPoly,
} from "./util/polyHelpers";
import { isEmpty, sortReverseAlpha } from "./util/baseHelpers";
import { NOT_FOUND, iconStarter, normalStyles } from "./util/constants";
import { EditTool, TransformTool } from "./tools";
import { DrawnObject } from "./model/types";
import IDrawingLayerTool from "./model/types/tool/IDrawingLayerTool";

export type MappedMarkersToVertices = {
  [vertKey: string]: Polyline;
};

/**
 * This class provide functions for using the state of the layer tool.
 *
 * @author Andrej Tlcina
 */
class DrawingLayerToolState extends AbstractLayerToolState {
  public featureGroup: FeatureGroup;
  public selecting: boolean;
  public selectedLayer: DrawnObject | null;
  public enabledTool: DrawnObject | null;
  public tool: IDrawingLayerTool;
  public createdVertices: Array<DrawnObject>;
  public mappedMarkersToVertices: MappedMarkersToVertices;
  public extraSelected: Array<DrawnObject>;
  /**
   * It creates a tool state.
   */
  public constructor(tool: IDrawingLayerTool) {
    super();

    this.featureGroup = new L.FeatureGroup();
    // * for knowing if we are using select tool
    this.selecting = false;
    // * for knowing if we already selected layer
    this.selectedLayer = null;
    // * enabled tool so we are able to switch it off
    this.enabledTool = null;

    this.tool = tool;

    this.createdVertices = [];
    this.mappedMarkersToVertices = {};

    // * selected for customization
    this.extraSelected = [];
  }

  /**
   * clears extraSelected array and sets normal styles to each geo. object
   */
  public clearExtraSelected = (): void => {
    this.extraSelected.forEach((selected) => {
      this.tool.normalizeElement(selected);
    });
    this.extraSelected = [];
  };

  /**
   * checks if layer is in extraSelected objects
   */
  private isInExtraSelected = (layerId: string): number => {
    const found = this.extraSelected
      .map((el) => el._leaflet_id)
      .indexOf(layerId);
    return found;
  };

  /**
   * checks if selected and passed object are of the same type
   */
  private areSameType = (layer: DrawnObject): boolean => {
    if (!this.selectedLayer) return false;

    if (isLayerPoly(this.selectedLayer)) {
      return isLayerPoly(layer);
    }

    return this.selectedLayer.layerType === layer.layerType;
  };

  /**
   * add passed layer to array and highlights it
   */
  public addExtraSelected = (layer: DrawnObject): void => {
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
   * checks if markers is connect marker
   */
  public isConnectMarker = (marker: DrawnObject | null): boolean => {
    return (
      marker?.layerType === "marker" &&
      marker?.options?.icon?.options?.connectClick
    );
  };

  /**
   * checks if selected layer is connect marker
   */
  public selectedLayerIsConnectMarker = (): boolean => {
    return this.isConnectMarker(this.selectedLayer);
  };

  /**
   * Pushes vertice into created ones
   */
  public pushVertice = (vertice: DrawnObject): void => {
    this.createdVertices.push(vertice);
  };

  /**
   * removes vertice based on given leaflet id
   *
   * @param {String} lId
   */
  public removeGivenVertice = (lId: string): void => {
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
  private removeMappedVertices = (
    idsOfVerticesToRemove: Set<string>
  ): MappedMarkersToVertices => {
    // * copy object
    const newMapped = { ...this.mappedMarkersToVertices };

    // *  go through each marker object, containing { [index]: vertice } pairs
    Object.values(newMapped).forEach((vertObj) => {
      // * now go through each index
      Object.keys(vertObj).forEach((key) => {
        const vert = vertObj[key];
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
   */
  public removeMarkersMappedVertices = (lId: string): void => {
    const markerVertices = this.mappedMarkersToVertices[lId];

    const idsOfVerticesToRemove: Set<string> = new Set();
    // * save vertices' ids
    Object.values(markerVertices)?.forEach((v) =>
      idsOfVerticesToRemove.add(v._leaflet_id)
    );

    // * remove vertices
    const newMapped = this.removeMappedVertices(idsOfVerticesToRemove);

    // * marker no longer has vertices, so remove it
    delete newMapped[lId];

    this.mappedMarkersToVertices = newMapped;
  };

  /**
   * setter
   */
  public setSelecting(is: boolean): void {
    this.selecting = is;
  }

  /**
   * getter
   */
  public getSelecting(): boolean {
    return this.selecting;
  }

  /**
   * add layer to featureGroup and it is displayed
   */
  public addLayer(layer: DrawnObject): DrawnObject {
    this.featureGroup.addLayer(layer);
    this.tool.applyEventListeners(layer);
    return layer;
  }

  /**
   * removes layer from featureGroup and from map
   */
  public removeLayer(layer: DrawnObject): void {
    this.featureGroup.removeLayer(layer);
  }

  /**
   * removes selected layer
   */
  public removeSelectedLayer(): void {
    if (!this.selectedLayer) return;
    TransformTool.disableTransform(this.selectedLayer);
    EditTool.disableNodeEdit(this.selectedLayer);
    this.featureGroup.removeLayer(this.selectedLayer);
    this.selectedLayer = null;
  }

  /**
   * sets selected layer and highlights it
   */
  public setSelectedLayer(layer: DrawnObject): void {
    this.tool.normalizeElement(this.selectedLayer);
    this.selectedLayer = layer;
    this.tool.highlightElement(layer);
    this.clearExtraSelected();
  }

  /**
   * removes selected layer
   */
  public clearSelectedLayer(): void {
    this.selectedLayer = null;
  }

  /**
   * sets vertices to marker
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
    if (!isEmpty<Object>(mappedProperty))
      result.mappedVertices = mappedProperty;
  };

  /**
   * called so when we import topology dragging of vertices works
   *
   * @param {*} lType
   * @param {*} result
   * @param {*} source
   */
  initMappedMarkersToVertices = (lType, result, source) => {
    if (lType === "marker" && source.mappedVertices) {
      this.mappedMarkersToVertices[result._leaflet_id] = source.mappedVertices;
    }
    if (lType === "polyline" || lType === "vertice") {
      // * keys are marker leaflet ids
      Object.keys(this.mappedMarkersToVertices).forEach((markerId) => {
        // * values are index of vertice
        let verticesKeyArr = Object.keys(
          this.mappedMarkersToVertices[markerId]
        );
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
      type: "FeatureCollection",
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
      if (l.layerType === "vertice")
        feature.properties.mappedVerticeId = l._leaflet_id;

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
    if (geojson.type === "FeatureCollection" && geojson.features) {
      geojson.features
        .sort((a, b) => sortReverseAlpha(a.geometry.type, b.geometry.type))
        .forEach((f) => {
          let opts = convertPropertiesToOptions(f.properties);
          let lType = getLeafletTypeFromFeature(f);
          let latlng = convertCoords(f);

          let result;
          if (lType === "polygon") {
            result = new L.polygon(latlng, opts);
          } else if (lType === "polyline") {
            result = new L.polyline(latlng, opts);
          } else if (lType === "marker") {
            let spreadable = f?.properties?.iconOptions || {};
            if (spreadable.iconUrl)
              sidebarState.appendToIconSrcs(spreadable.iconUrl);
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
            sidebarState.pushGuideLayer(result);

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
            this.initMappedMarkersToVertices(lType, result, f.properties);
            this.addLayer(result);
          }
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
      const { options, _latlngs: latlngs, popupContent = "" } = layer;
      exportSettings.push({
        layerType,
        options: {
          ...options,
          ...normalStyles,
          draggable: true,
          transform: true,
        },
        latlngs,
        popupContent,
        ...extra,
      });
    };

    const pushMarker = (layer, layerType) => {
      const { popupContent = "" } = layer;
      let extra = {};
      if (this.isConnectMarker(layer)) {
        this.addMappedVertices(layer, extra);
      }
      exportSettings.push({
        layerType,
        options: {
          ...layer?.options?.icon?.options,
          draggable: true,
          transform: true,
        },
        latlngs: layer._latlng,
        popupContent,
        ...extra,
      });
    };

    this.featureGroup.eachLayer((layer) => {
      const { layerType } = layer;
      if (layerType === "marker") {
        pushMarker(layer, layerType);
      } else {
        if (layer._layers) {
          layer.eachLayer((l) => {
            pushPolygon(l, layerType);
          });
        } else {
          let extra =
            layerType === "vertice"
              ? { mappedVerticeId: layer._leaflet_id }
              : {};
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
      if (layer.layerType === "marker") {
        let { latlngs } = layer;
        let latlng = L.latLng(latlngs.lat, latlngs.lng);
        if (layer?.options?.iconUrl)
          sidebarState.appendToIconSrcs(layer.options.iconUrl);
        let options = {
          ...layer.options,
          iconAnchor: new L.Point(
            layer.options.iconAnchor.x,
            layer.options.iconAnchor.y
          ),
          iconSize: new L.Point(
            layer.options.iconSize.x,
            layer.options.iconSize.y
          ),
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
        if (layer.layerType === "polyline" || layer.layerType === "vertice") {
          _latlng = layer.latlngs[0].map((l) => L.latLng(l.lat, l.lng));
          poly = new L.polyline(_latlng, layer.options);
        }
        if (layer.layerType === "polygon" || layer.layerType === "painted") {
          _latlng = layer.latlngs[0].map((l) => L.latLng(l.lat, l.lng));
          poly = new L.polygon(_latlng, layer.options);
        }

        layerToAdd = poly;
      }

      if (layer.popupContent) {
        layerToAdd.bindPopup(layer.popupContent, {
          closeOnClick: false,
          autoClose: false,
        });
        layerToAdd.popupContent = layer.popupContent;
      }

      sidebarState.pushGuideLayer(layer);

      layerToAdd.layerType = layer.layerType;
      if (layerToAdd.dragging) layerToAdd.dragging.disable();
      this.initMappedMarkersToVertices(layer.layerType, layerToAdd, layer);
      this.addLayer(layerToAdd);
    });
  }
}
export default DrawingLayerToolState;
