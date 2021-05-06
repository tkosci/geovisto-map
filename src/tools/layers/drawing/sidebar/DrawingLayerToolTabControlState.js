import AbstractLayerToolTabControlState from '../../abstract/sidebar/AbstractLayerToolTabControlState';
import PaintPoly from '../components/paintPoly';

import '../style/drawingLayerTabControl.scss';
import { geoSearch, iconStarter, putMarkerOnMap } from '../util/Marker';
import { highlightStyles, normalStyles, simplifyFeature } from '../util/Poly';
import { debounce } from '../util/functionUtils';
import { createIntervalInput, createCheck } from '../components/inputs';

import * as osmtogeojson from 'osmtogeojson';
import * as turf from '@turf/turf';
import { FIRST } from '../util/constants';

export const ICON_SRCS = [
  'https://upload.wikimedia.org/wikipedia/commons/0/0a/Marker_location.png',
  'https://icons.iconarchive.com/icons/icons-land/vista-map-markers/32/Map-Marker-Flag-1-Right-Azure-icon.png',
];
export const COLORS = [
  '#1ABC9C',
  '#16A085',
  '#2ECC71',
  '#27AE60',
  '#3498DB',
  '#2980B9',
  '#9B59B6',
  '#8E44AD',
  '#34495E',
  '#2C3E50',
  '#F1C40F',
  '#F39C12',
  '#E67E22',
  '#D35400',
  '#E74C3C',
  '#C0392B',
  '#ECF0F1',
  '#BDC3C7',
  '#95A5A6',
  '#7F8C8D',
];
export const STROKES = [
  { label: 'thin', value: 3 },
  { label: 'medium', value: 5, selected: true },
  { label: 'bold', value: 7 },
];
export const ADMIN_LEVELS = [
  { label: 'State', value: 2 },
  { label: 'Province', value: 4, selected: true },
  { label: '5 (depends on country)', value: 5 },
  { label: '6 (depends on country)', value: 6 },
  { label: '7 (depends on country)', value: 7 },
  { label: '8 (depends on country)', value: 8 },
  { label: '9 (depends on country)', value: 9 },
  { label: '10 (depends on country)', value: 10 },
];

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

    this.connectActivated = false;

    this.intersectActivated = false;

    this.paintPoly = new PaintPoly({
      tabState: this,
    });

    this.pather = new L.Pather({
      strokeWidth: 3,
      smoothFactor: 5,
      moduleClass: 'leaflet-pather',
      pathColour: '#333',
    });
    this.patherActive = false;

    this.countries = require('/static/geo/iso3166_countries.json');
    this.countryCode = '';
    this.adminLevel = ADMIN_LEVELS[1].value;
    this.highQuality = false;

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
   * sets country code to look for with request
   *
   * @param {String} val
   */
  setCountryCode(val) {
    this.countryCode = val;
  }
  /**
   * sets admin level to look for with request
   *
   * @param {String} val
   */
  setAdminLevel(val) {
    this.adminLevel = val;
  }
  /**
   * sets whether displayed polygon will be of high quality
   *
   * @param {Boolean} val
   */
  setHighQuality(val) {
    this.highQuality = val;
  }

  /**
   * returns state of a drawing tool
   *
   * @returns {Object}
   */
  getToolState() {
    return this.getTool().getState();
  }

  /**
   * sets whether pather (freehand cutting) is active
   *
   * @param {Boolean} val
   */
  setPatherStatus(val) {
    this.patherActive = val;
  }

  /**
   * sets whether we are creating topology with search
   *
   * @param {Boolena} val
   */
  setConnectActivated(val) {
    this.connectActivated = val;
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

  /**
   * sets enabled element, which is an element that is active (do not get confused with selected object)
   * these can be active marker, polyline, polygon tools
   *
   * @param {Layer} val
   */
  setEnabledEl(val) {
    this.enabledEl?.disable();
    this.enabledEl = val;
    // this.tool.state.setSelectedLayer(null);
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
   * setter of "column header name"
   *
   * @param {*} val
   */
  setIdentifierType(val) {
    this.identifierType = val;
  }

  /**
   * getter
   *
   * @returns {object}
   */
  getEnabledEl() {
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
   * setter
   */
  setSelectedColor(value) {
    this.selectedColor = value;
  }

  /**
   * setter
   */
  setSelectedStroke(value) {
    this.selectedStroke = value;
  }

  /**
   * setter
   */
  setSelectedIcon(value) {
    this.selectedIcon = value;
  }

  /**
   * setter
   */
  setSearchOpts(opts) {
    this.searchOpts = opts;
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
   * takes countries from static file and maps through them
   *
   * @returns {Array<{value: string, label: string}>}
   */
  getSelectCountries() {
    const result = this.countries.map((c) => ({ value: c['alpha-2'], label: c['name'] }));
    return [{ value: '', label: '' }, ...result];
  }

  /**
   * sets new color to selected object and to extra selected ones
   *
   * @param {string} color
   */
  changeColorAction = (color) => {
    const selectedEl = this._getSelected();
    this.setSelectedColor(color);
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
    this.setSelectedStroke(weight);
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

    this.setSelectedIcon(icon);
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
    const modInputText = this.tabControl.convertDescToPopText(inputText);

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

    this.setIdentifierType(id);

    this.tabControl.redrawTabContent(selectedEl?.layerType);
  };

  /**
   * sets new options for place search
   *
   * @param {Object} e
   */
  searchAction = async (e) => {
    const value = e.target.value;
    const featureGroup = this.getTool()?.getState()?.featureGroup;

    const opts = await geoSearch(featureGroup, value);

    this.setSearchOpts(opts);
    this.tabControl.inputSearch.changeOptions(opts ? opts.map((opt) => opt.label || '') : []);
    // this.inputSearch.redrawMenu();
  };

  /**
   * called when user picks a place from displayed options
   *
   * @param {String} value
   */
  onInputOptClick = (value) => {
    const featureGroup = this.getTool()?.getState().featureGroup;
    const { searchOpts: opts, connectActivated } = this;

    const found = opts.find((opt) => opt.label === value);

    let latlng = L.latLng(0, 0);
    latlng.lat = found?.y || 0;
    latlng.lng = found?.x || 0;
    const iconUrl = found?.raw?.icon || ICON_SRCS[0];
    const marker = putMarkerOnMap(featureGroup, latlng, found?.label, iconUrl, connectActivated);
    this.getTool().applyEventListeners(marker);
    this.getTool().applyTopologyMarkerListeners(marker);
    this.setSelectedIcon(iconUrl);
    this.appendToIconSrcs(iconUrl);
    if (connectActivated) {
      this.getTool().plotTopology();
    }
    this.tabControl.redrawTabContent('search');
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
   * builds query from inputed values and send it to Overpass API
   *
   * @returns
   */
  fetchAreas = async () => {
    const { countryCode, adminLevel, highQuality } = this;

    if (!countryCode || !adminLevel) return;

    const toolState = this.getTool().getState();

    const endPoint = 'https://overpass-api.de/api/interpreter?data=[out:json];';
    const query = `area["ISO3166-1"="${countryCode}"]->.searchArea;(relation["admin_level"="${adminLevel}"](area.searchArea););out;>;out skel qt;`;

    document.querySelector('.leaflet-container').style.cursor = 'wait';
    this.tabControl.searchForAreasBtn.setAttribute('disabled', true);

    fetch(endPoint + query)
      .then((response) => response.json())
      .then((data) => {
        const gJSON = osmtogeojson(data);

        const opts = {
          color: this.selectedColor,
          draggable: true,
          transform: true,
        };

        toolState.featureGroup.eachLayer((layer) => {
          if (layer.countryCode === countryCode) toolState.removeLayer(layer);
        });

        gJSON?.features
          ?.filter((feat) => feat?.geometry?.type === 'Polygon')
          ?.forEach((feat) => {
            let coords = feat.geometry.coordinates;
            if (!highQuality) {
              let simplified = simplifyFeature(feat, 0.01);
              coords = simplified.geometry.coordinates;
            }
            let latlngs = L.GeoJSON.coordsToLatLngs(coords, 1);
            let result = new L.polygon(latlngs, { ...opts, ...normalStyles });
            result?.dragging?.disable();
            result.layerType = 'polygon';
            result.countryCode = countryCode;
            toolState.addLayer(result);
          });
        this.tabControl.errorMsg.innerText = '';
      })
      .catch((err) => {
        this.tabControl.errorMsg.innerText = 'There was a problem, re-try later.';
        console.error(err);
      })
      .finally(() => {
        document.querySelector('.leaflet-container').style.cursor = '';
        this.tabControl.searchForAreasBtn.removeAttribute('disabled');
      });
  };

  /**
   * sets for what area we are searching for
   *
   * @param {Object} e
   */
  searchForAreaAction = (e) => {
    const val = e.target.value;
    this.setCountryCode(val);
  };

  /**
   * sets for what administration level we are searching for
   *
   * @param {Object} e
   */
  pickAdminLevelAction = (e) => {
    const val = e.target.value;
    this.setAdminLevel(val);
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
