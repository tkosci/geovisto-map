import L from 'leaflet';

import AbstractLayerToolTabControlState from '../../abstract/sidebar/AbstractLayerToolTabControlState';

import '../style/drawingLayerTabControl.scss';
import { simplifyFeature } from '../util/Poly';

import * as osmtogeojson from 'osmtogeojson';
import {
  ICON_SRCS,
  COLORS,
  STROKES,
  ADMIN_LEVELS,
  iconStarter,
  normalStyles,
} from '../util/constants';
import { SearchTool } from '../tools';
import DataControl from './components/DataControl/DataControl';

/**
 * This class manages the state of the sidebar tab.
 * It wraps the state since the sidebar tab can work with state objects which needs to be explicitly serialized.
 *
 * @author Andrej Tlcina
 */
class DrawingLayerToolTabControlState extends AbstractLayerToolTabControlState {
  /**
   * It creates a tab control state.
   */
  constructor(tabControl) {
    super();
    this.tabControl = tabControl;

    this.colors = COLORS;
    this.selectedColor = COLORS[0];

    this.strokes = STROKES;
    this.selectedStroke = STROKES[1].value;

    this.iconSrcs = new Set(ICON_SRCS);
    this.selectedIcon = ICON_SRCS[0];

    // * element/layer that was enabled and not created yet
    this.enabledEl = null;

    this.identifierType = '';

    this.searchOpts = [];

    this.guideLayers = [];

    this.intersectActivated = false;

    this.filtersAmount = 0;
    this.filtersKeys = [];
    this.filtersValues = [];
  }

  /**
   * clears all filters for data mapping
   */
  clearFilters() {
    this.filtersAmount = 0;
    this.filtersKeys = [];
    this.filtersValues = [];
  }

  /**
   * gets filter key (column header)
   *
   * @param {Number} idx
   * @returns {String}
   */
  getFiltersKey(idx) {
    const key = this.filtersKeys[idx];
    return key;
  }

  /**
   * gets value in column
   *
   * @param {Number} idx
   * @returns {any} value in column
   */
  getFiltersValue(idx) {
    const value = this.filtersValues[idx];
    return value;
  }

  /**
   * sets value in filterKeys array
   *
   * @param {Number} idx
   * @param {any} value
   * @returns
   */
  setFiltersKey(idx, value) {
    if (idx > this.filtersAmount) return;
    this.filtersKeys[idx] = value;
  }

  /**
   * sets value in filterValues array
   *
   * @param {Number} idx
   * @param {any} value
   * @returns
   */
  setFiltersValue(idx, value) {
    if (idx > this.filtersAmount) return;
    this.filtersValues[idx] = value;
  }

  /**
   * runs whenever user clicks on 'Add Filter' button
   * essentially creates new filter
   */
  increaseFilters = () => {
    this.filtersAmount += 1;
    this.filtersKeys.push('');
    this.filtersValues.push('');
  };
  /**
   * runs whenever user clicks on 'Remove Filter' button
   * essentially removes last added filter and it's values
   */
  decreaseFilters = () => {
    if (this.filtersAmount === 0) return;
    this.filtersAmount -= 1;
    this.filtersKeys.pop();
    this.filtersValues.pop();
  };

  /**
   * returns state of a drawing tool
   *
   * @returns {Object}
   */
  getToolState() {
    return this.getTool().getState();
  }

  /**
   * sets whether we are creating new polygons within selected one
   *
   * @param {Boolean} val
   */
  setIntersectActivated(val) {
    this.intersectActivated = val;
  }

  /**
   * adds guide layer for snapping
   *
   * @param {Layer} layer
   */
  pushGuideLayer(layer) {
    this.guideLayers.push(layer);
  }

  setEnabledTool(val) {
    this.enabledEl?.disable();
    this.enabledEl = val;
  }

  /**
   * returns "column header name"
   *
   * @returns {string}
   */
  getIdentifierType() {
    return this.identifierType;
  }

  /**
   * getter
   *
   * @returns {object}
   */
  getEnabledTool() {
    return this.enabledEl;
  }

  /**
   * getter
   *
   * @returns {String}
   */
  getSelectedColor() {
    return this.selectedColor;
  }

  /**
   * getter
   *
   * @returns {String}
   */
  getSelectedStroke() {
    return this.selectedStroke;
  }

  /**
   * getter
   *
   * @returns {String}
   */
  getSelectedIcon() {
    return this.selectedIcon;
  }

  /**
   * append to icon Set
   *
   * @param {string} iconUrl
   */
  appendToIconSrcs(iconUrl) {
    this.iconSrcs.add(iconUrl);
  }

  /**
   * sets new color to selected object and to extra selected ones
   *
   * @param {string} color
   */
  changeColorAction = (color) => {
    const selectedEl = this._getSelected();
    this.selectedColor = color;
    if (selectedEl?.setStyle) selectedEl.setStyle({ color });
    this._getExtraSelected().forEach((layer) => {
      layer?.setStyle({ color });
    });
  };

  /**
   * sets new stroke weight to selected object and to extra selected ones
   *
   * @param {Object} e
   */
  changeWeightAction = (e) => {
    const weight = Number(e.target.value);
    const selectedEl = this._getSelected();
    this.selectedStroke = weight;
    if (selectedEl?.setStyle) selectedEl.setStyle({ weight });
    this._getExtraSelected().forEach((layer) => {
      layer?.setStyle({ weight });
    });
  };

  /**
   * sets new marker icon options (iconUrl, anchor...) to selected object and to extra selected ones
   *
   * @param {Object} iconOpt
   * @returns {Layer}
   */
  changeIconOpts = (iconOpt = {}) => {
    const { enabledEl } = this;

    let selectedEl = this._getSelected();
    let marker = selectedEl;

    if (enabledEl?.type === 'marker') {
      selectedEl = enabledEl;
      marker = enabledEl._marker;
    }

    let oldIconOptions = selectedEl?.options?.icon?.options || {};
    let newIconOptions = {
      ...oldIconOptions,
      ...iconOpt,
    };

    const markerIcon = new L.Icon(newIconOptions);
    if (marker) marker.setIcon(markerIcon);
    this.tool.highlightElement(marker);
    this._getExtraSelected().forEach((layer) => {
      layer?.setIcon(markerIcon);
      this.tool.highlightElement(layer);
    });
    if (enabledEl?.type === 'marker') enabledEl.setIconOptions(markerIcon);

    return marker;
  };

  /**
   * sets new icon to marker
   *
   * @param {String} icon
   */
  changeIconAction = (icon) => {
    this.changeIconOpts({ iconUrl: icon });

    this.selectedIcon = icon;
    this.tabControl.redrawTabContent('marker');
  };

  /**
   * sets new anchor to marker
   *
   * @param {Number} val
   * @param {'x' | 'y'} coordinate
   */
  changeIconAnchor = (val, coordinate) => {
    const selectedEl = this.enabledEl || this._getSelected();
    let iconOptions = selectedEl?.options?.icon?.options || {};
    const iconAnchor = iconOptions.iconAnchor || iconStarter.iconAnchor;
    iconAnchor[coordinate] = val;
    this.changeIconOpts({ iconAnchor });
  };

  /**
   * called on change of field
   *
   * @param {Object} e
   */
  changeDescriptionAction = (e) => {
    this.changeDesc(e.target.value);
  };

  /**
   * Takes selected element and bind new popup to it
   *
   * @param {String} inputText
   */
  changeDesc = (inputText) => {
    const selectedEl = this._getSelected();
    const modInputText = DataControl.convertDescToPopText(inputText);

    let popup1 = selectedEl.getPopup();
    if (popup1) {
      popup1.setContent(modInputText);
    } else {
      selectedEl.bindPopup(modInputText, { closeOnClick: false, autoClose: false });
    }
    // store for import
    if (selectedEl) selectedEl.popupContent = modInputText;
    if (selectedEl?.setStyle) selectedEl.setStyle(modInputText);
  };

  /**
   * forcefuly change identifier (not on field change)
   *
   * @param {Boolean} haveToCheckFilters
   * @returns
   */
  callIdentifierChange = (haveToCheckFilters = false) => {
    if (haveToCheckFilters && this.filtersAmount === 0) return;
    const selectedEl = this._getSelected();
    this.changeIdentifierAction(selectedEl?.identifier);
  };

  /**
   * called on field change
   *
   * @param {String} id
   * @returns
   */
  changeIdentifierAction = (id) => {
    if (!id) return;
    const selectedEl = this._getSelected();
    if (selectedEl) selectedEl.identifier = id;

    const data = this.getTool()?.getState()?.map?.state?.data;

    // * create new variable and store imported data
    let filteredData = data;
    // * go through all appended filter keys
    this.filtersKeys.forEach((key, idx) => {
      // * loop through each row of imported data
      filteredData = filteredData.filter((d) => String(d[key]) === this.filtersValues[idx]);
    });

    const idType = this.identifierType;
    const found = filteredData.find((d) => String(d[idType]) === id);

    let popupText = '';
    if (found) {
      Object.keys(found).forEach((key) => {
        popupText += `${key}: ${found[key]}<br />`;
      });
    }

    this.changeDesc(popupText);
    this.tabControl.redrawTabContent(selectedEl?.layerType);
  };

  /**
   * sets which column we should take identifier from
   *
   * @param {Object} e
   */
  changeWhichIdUseAction = (e) => {
    const id = e.target.value;
    const selectedEl = this._getSelected();

    this.identifierType = id;

    this.tabControl.redrawTabContent(selectedEl?.layerType);
  };

  /**
   * runs on 'Enter' whenever user adds new icon to list of icons
   *
   * @param {Object} e
   */
  addIconAction = (e) => {
    const iconUrl = e.target.value;
    this.appendToIconSrcs(iconUrl);
    this.tabControl.redrawTabContent('marker');
  };

  /**
   * gets selected object
   *
   * @returns {Layer}
   */
  _getSelected() {
    return this.getTool().getState().selectedLayer;
  }

  /**
   * gets array of extra selected objects
   *
   * @returns {Array<Layer>}
   */
  _getExtraSelected() {
    return this.getTool().getState().extraSelected;
  }
}
export default DrawingLayerToolTabControlState;
