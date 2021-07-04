import L from 'leaflet';
import 'leaflet-path-drag';
import 'leaflet-path-transform';
import 'leaflet-draw';

import AbstractTool from './AbstractTool';
import {
  getGeoJSONFeatures,
  isFeaturePoly,
  isLayerPoly,
  morphFeatureToPolygon,
} from '../util/Poly';
import union from '@turf/union';
import TopologyTool from './TopologyTool';

class JoinTool extends AbstractTool {
  constructor(props) {
    super(props);
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
    const toolState = this.drawingTool.getState();
    const selecting = toolState.getSelecting();
    toolState.setSelecting(!selecting);
    if (!selecting) document.querySelector('.leaflet-container').style.cursor = 'crosshair';
    else document.querySelector('.leaflet-container').style.cursor = '';
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
    const layerState = this.drawingTool.getState();

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
          .map((chosen) => getGeoJSONFeatures(chosen));

        if (chosenFeatures.length !== chosenLayers.length) return;

        const first = this._getSummedFeature(chosenFeatures[0]);
        const second = this._getSummedFeature(chosenFeatures[1]);

        const resultFeature = union(first, second);
        const opts = { ...chosenLayers[0].options, ...chosenLayers[1].options };
        const result = morphFeatureToPolygon(resultFeature, opts, false);
        layerState.pushJoinedToChosenLayers(result);

        this._redrawSidebar(drawObject.layerType);
      }
      // *  if all markers plot topology
      if (layerState.chosenLayersAreMarkers()) {
        const { chosenLayers } = layerState;

        // TODO: extends this class differently
        const topo = this.drawingTool.drawingTools[TopologyTool.NAME()];
        topo.plotTopology(chosenLayers);

        layerState.deselectChosenLayers();
        layerState.clearChosenLayers();

        this._redrawSidebar(null);
      }
    }
  };

  disable = () => {
    this.enable();
    this.drawingTool.getState().deselectChosenLayers();
  };
}

export default JoinTool;
