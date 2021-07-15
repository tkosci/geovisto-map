import L from 'leaflet';
import 'leaflet-path-drag';
import 'leaflet-path-transform';
import 'leaflet-draw';
import * as turf from '@turf/turf';

import { AbstractTool } from '../AbstractTool';
import '../../components/Knife';
import { getFirstGeoJSONFeature, isFeaturePoly } from '../../util/Poly';
import { normalStyles } from '../../util/constants';

class GeometricSliceTool extends AbstractTool {
  static result = 'knife';

  constructor(props) {
    super(props);

    this.leafletMap.on('draw:created', this.created);
  }

  static NAME(): string {
    return 'geometric-slice-drawing-tool';
  }

  getName(): string {
    return GeometricSliceTool.NAME();
  }

  getIconName(): string {
    return 'fa fa-scissors';
  }

  getTitle(): string {
    return 'Division tool';
  }

  canBeCanceled = (): boolean => {
    return true;
  };

  created = (e) => {
    let layer = e.layer;
    if (!layer) return;

    // * SLICE
    if (e.layerType === GeometricSliceTool.result) {
      this.polySlice(layer);
      this.deactivate();
    }
  };

  /**
   * @brief - inspired by https://gis.stackexchange.com/questions/344068/splitting-a-polygon-by-multiple-linestrings-leaflet-and-turf-js
   *        - slices selected object with currently created one
   *
   * @param {Layer} layer
   */
  polySlice(layer): void {
    let lineFeat = getFirstGeoJSONFeature(layer);
    let selectedLayer = this.drawingTool.getState().selectedLayer;

    if (selectedLayer) {
      const THICK_LINE_WIDTH = 0.00001;
      const THICK_LINE_UNITS = 'kilometers';
      let offsetLine;
      let selectedFeature = getFirstGeoJSONFeature(selectedLayer);

      let isFeatPoly = isFeaturePoly(selectedFeature);

      if (isFeatPoly) {
        let coords;
        let latlngs;
        try {
          offsetLine = turf.lineOffset(lineFeat, THICK_LINE_WIDTH, {
            units: THICK_LINE_UNITS,
          });

          let polyCoords = [];
          // * push all of the coordinates of original line
          for (let j = 0; j < lineFeat.geometry.coordinates.length; j++) {
            polyCoords.push(lineFeat.geometry.coordinates[j]);
          }
          // * push all of the coordinates of offset line
          for (let j = offsetLine.geometry.coordinates.length - 1; j >= 0; j--) {
            polyCoords.push(offsetLine.geometry.coordinates[j]);
          }
          // * to create linear ring
          polyCoords.push(lineFeat.geometry.coordinates[0]);

          let thickLineString = turf.lineString(polyCoords);
          let thickLinePolygon = turf.lineToPolygon(thickLineString);
          let clipped = turf.difference(selectedFeature, thickLinePolygon);
          // clipped = simplifyFeature(clipped);

          coords = clipped.geometry.coordinates;
          this.drawingTool.getState().removeSelectedLayer();
          coords.forEach((coord) => {
            latlngs = L.GeoJSON.coordsToLatLngs(coord, 1);
            let result = new L.polygon(latlngs, {
              ...selectedLayer.options,
              ...normalStyles,
            });
            result.layerType = 'polygon';
            this.drawingTool.getState().addLayer(result);
          });
        } catch (error) {
          console.error({ coords, latlngs, error });
        }
      }
    }
  }

  _dividePoly = (): void => {
    this.tool = new L.Draw.Slice(this.leafletMap, {
      shapeOptions: {
        color: '#333',
        weight: 3,
        draggable: true,
        transform: true,
        guideLayers: this.sidebar.getState().guideLayers,
      },
    });
    this.tool.enable();
  };

  enable = (): void => {
    this._dividePoly();
  };

  disable = () => {
    let activeTool = this.tool;
    if (activeTool) {
      activeTool.disable();
    }

    // * hide extra btn for disabling tools
    const query = `.drawingtoolbar .${this.getName()} .extra-btn`;
    const divideBtn = document.querySelector(query);
    if (divideBtn) divideBtn.classList.add('hide');
  };
}

export default GeometricSliceTool;
