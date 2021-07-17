import L from 'leaflet';
import 'leaflet-path-drag';
import 'leaflet-path-transform';
import 'leaflet-draw';
import osmtogeojson from 'osmtogeojson';
import { SearchTool, TopologyTool } from '../../../tools';
import { ADMIN_LEVELS, ICON_SRCS, normalStyles } from '../../../util/constants';
import { simplifyFeature } from '../../../util/polyHelpers';
import AbstractControlState from '../AbstractControl/AbstractControlState';

class SearchControlState extends AbstractControlState {
  constructor(props) {
    super(props);

    this.countries = require('/static/geo/iso3166_countries.json');
    this.countryCode = '';

    this.adminLevel = ADMIN_LEVELS[1].value;
    this.searchOpts = [];

    this.highQuality = false;
    this.connectActivated = false;
  }

  /**
   * takes countries from static file and maps through them
   */
  getSelectCountries(): { value: string, label: string }[] {
    const result = this.countries.map((c) => ({ value: c['alpha-2'], label: c['name'] }));
    return [{ value: '', label: '' }, ...result];
  }

  /**
   * sets whether displayed polygon will be of high quality
   */
  setHighQuality(val: boolean) {
    this.highQuality = val;
  }

  /**
   * sets whether we are creating topology with search
   */
  setConnectActivated(val: boolean) {
    this.connectActivated = val;
  }

  /**
   * sets for what area we are searching for
   *
   * @param {Object} e
   */
  searchForAreaAction = (e) => {
    const val = e.target.value;
    this.countryCode = val;
  };

  /**
   * sets for what administration level we are searching for
   *
   * @param {Object} e
   */
  pickAdminLevelAction = (e) => {
    const val = e.target.value;
    this.adminLevel = val;
  };

  /**
   * sets new options for place search
   *
   * @param {Object} e
   */
  searchAction = async (e: Object) => {
    const value = e.target.value;
    const featureGroup = this.tool.getState().featureGroup;

    const opts = await SearchTool.geoSearch(featureGroup, value);

    this.searchOpts = opts;
    this.control.inputSearch.changeOptions(opts ? opts.map((opt) => opt.label || '') : []);
  };

  /**
   * called when user picks a place from displayed options
   *
   * @param {String} value
   */
  onInputOptClick = (value) => {
    const featureGroup = this.tabControl.getTool().getState().featureGroup;
    const { searchOpts: opts, connectActivated } = this;

    const found = opts.find((opt) => opt.label === value);

    let latlng = L.latLng(0, 0);
    latlng.lat = found?.y || 0;
    latlng.lng = found?.x || 0;
    const iconUrl = found?.raw?.icon || ICON_SRCS[0];
    const marker = SearchTool.putMarkerOnMap(
      featureGroup,
      latlng,
      found?.label,
      iconUrl,
      connectActivated,
    );
    this.tool.applyEventListeners(marker);
    this.tool.applyTopologyMarkerListeners(marker);
    this.selectedIcon = iconUrl;
    this.appendToIconSrcs(iconUrl);
    if (connectActivated) {
      this.tool.drawingTools[TopologyTool.NAME()].plotTopology();
    }
    this.tabControl.redrawTabContent('search');
  };

  /**
   * builds query from inputed values and send it to Overpass API
   *
   * @returns
   */
  fetchAreas = async () => {
    const { countryCode, adminLevel, highQuality } = this;

    if (!countryCode || !adminLevel) return;

    const toolState = this.tool.getState();

    const endPoint = 'https://overpass-api.de/api/interpreter?data=[out:json];';
    const query = `area["ISO3166-1"="${countryCode}"]->.searchArea;(relation["admin_level"="${adminLevel}"](area.searchArea););out;>;out skel qt;`;

    document.querySelector('.leaflet-container').style.cursor = 'wait';
    this.control.searchForAreasBtn.setAttribute('disabled', true);

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
        this.control.errorMsg.innerText = '';
      })
      .catch((err) => {
        this.control.errorMsg.innerText = 'There was a problem, re-try later.';
        console.error(err);
      })
      .finally(() => {
        document.querySelector('.leaflet-container').style.cursor = '';
        this.control.searchForAreasBtn.removeAttribute('disabled');
      });
  };
}

export default SearchControlState;
