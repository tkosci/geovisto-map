import L from 'leaflet';
import 'leaflet-path-drag';
import 'leaflet-path-transform';
import 'leaflet-draw';

import {
  getGeoJSONFeatures,
  isFeaturePoly,
  isLayerPoly,
  morphFeatureToPolygon,
} from '../../util/polyHelpers';
import union from '@turf/union';
import { isEmpty } from '../../util/baseHelpers';
import { FIRST } from '../../util/constants';
import { TopologyTool } from '../TopologyTool';

const MAX_CHOSEN = 2;

class JoinTool extends TopologyTool {
  constructor(props) {
    super(props);

    // * selected for join
    this.chosenLayers = [];
  }

  static NAME(): string {
    return 'join-drawing-tool';
  }

  getName(): string {
    return JoinTool.NAME();
  }

  getIconName(): string {
    return 'fa fa-plus-circle';
  }

  getTitle(): string {
    return 'Join drawing tool';
  }

  result(): string {
    return '';
  }

  canBeCanceled(): boolean {
    return true;
  }

  enable = () => {
    this._redrawSidebar(this.result());
    this._isActive = true;
    const toolState = this.drawingTool.getState();
    toolState.setSelecting(true);
    document.querySelector('.leaflet-container').style.cursor = 'crosshair';
  };

  disable = () => {
    this._redrawSidebar(this.result());
    this._isActive = false;
    const toolState = this.drawingTool.getState();
    toolState.setSelecting(false);
    document.querySelector('.leaflet-container').style.cursor = '';
    this.deselectChosenLayers();
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
    this.drawingTool.highlightElement(layer);
    this.chosenLayers.push(layer);
  };

  /**
   * deselects all selected ones
   */
  deselectChosenLayers = () => {
    this.chosenLayers.forEach((chosen) => this.drawingTool.normalizeElement(chosen));
    this.chosenLayers = [];
  };

  /**
   * removes all selected ones
   */
  clearChosenLayers = () => {
    this.chosenLayers.forEach((chosen) => this.drawingTool.getState().removeLayer(chosen));
    this.chosenLayers = [];
  };

  /**
   * layers are joined which means remove previous ones and append joined
   *
   * @param {Layer} joined
   */
  pushJoinedToChosenLayers = (joined) => {
    this.clearChosenLayers();
    this.drawingTool.highlightElement(joined);
    this.chosenLayers.push(joined);
    this.drawingTool.getState().addLayer(joined);
  };

  /**
   * @brief unifies all the features in array
   *
   * @param {Array<Layer>} features
   * @returns
   */
  _getSummedFeature = (features) => {
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

  joinChosen = (drawObject) => {
    const unfit = !this.canPushToChosen(drawObject);
    if (unfit) return;
    this.pushChosenLayer(drawObject);
    // * if true that means user selected second geo. object of the same correct type
    if (this.chosenLayersMaxed()) {
      // * if all polys unify them
      if (this.chosenLayersArePolys()) {
        const { chosenLayers } = this;
        const chosenFeatures = chosenLayers
          .filter((c) => isLayerPoly(c))
          .map((chosen) => getGeoJSONFeatures(chosen));

        if (chosenFeatures.length !== chosenLayers.length) return;

        const first = this._getSummedFeature(chosenFeatures[0]);
        const second = this._getSummedFeature(chosenFeatures[1]);

        const resultFeature = union(first, second);
        const opts = { ...chosenLayers[0].options, ...chosenLayers[1].options };
        const result = morphFeatureToPolygon(resultFeature, opts);
        this.pushJoinedToChosenLayers(result);

        this._redrawSidebar(drawObject.layerType);
      }
      // *  if all markers plot topology
      if (this.chosenLayersAreMarkers()) {
        const { chosenLayers } = this;

        this.plotTopology(chosenLayers);

        this.deselectChosenLayers();
        this.clearChosenLayers();

        this._redrawSidebar(null);
      }
    }
  };
}

export default JoinTool;
