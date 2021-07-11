import L from 'leaflet';
import 'leaflet-path-drag';
import 'leaflet-path-transform';
import 'leaflet-draw';

import { OpenStreetMapProvider } from 'leaflet-geosearch';

import { AbstractTool } from '../AbstractTool';
import { iconStarter, ICON_SRCS } from '../../util/constants';

class SearchTool extends AbstractTool {
  constructor(props) {
    super(props);
  }

  static NAME(): string {
    return 'search-drawing-tool';
  }

  getName(): string {
    return SearchTool.NAME();
  }

  getIconName(): string {
    return 'fa fa-search';
  }

  getTitle(): string {
    return 'Search drawing tool';
  }

  result = (): string => {
    return 'search';
  };

  enable = (): void => {
    this._redrawSidebar(this.result());
  };

  /**
   * append marker on map with given latlng
   *
   * @param {Object} featureGroup
   * @param {*} latlng
   * @param {String} popup
   * @param {String} iconUrl
   * @param {Boolean} connectClick
   * @returns {Layer}
   */
  static putMarkerOnMap = (featureGroup, latlng, popup, iconUrl, connectClick = false) => {
    const additionalOpts = { iconUrl: iconUrl || ICON_SRCS[0], connectClick };
    const icon = new L.Icon({
      ...iconStarter,
      ...additionalOpts,
    });

    let marker = new L.Marker.Touch(latlng, { icon });
    if (popup) {
      marker.bindPopup(popup, { closeOnClick: false, autoClose: false });
      marker.popupContent = popup;
    }

    marker.layerType = 'marker';
    featureGroup.addLayer(marker);
    // map.fire(L.Draw.Event.CREATED, { layer: marker, layerType: 'marker' });
    return marker;
  };

  /**
   * sends request to OSM with given query
   *
   * @param {Object} featureGroup
   * @param {String} query
   * @returns
   */
  static geoSearch = async (featureGroup, query = '') => {
    if (!query) return;

    // setup
    const provider = new OpenStreetMapProvider();

    // search
    const results = await provider.search({ query });

    return results;
  };
}

export default SearchTool;
