import L, { FeatureGroup, LatLng } from 'leaflet';
import 'leaflet-path-drag';
import 'leaflet-path-transform';
import 'leaflet-draw';

import { OpenStreetMapProvider } from 'leaflet-geosearch';

import { AbstractTool } from '../AbstractTool';
import { iconStarter, ICON_SRCS } from '../../util/constants';
import { DrawnObject, LayerType, LooseObject } from '../../model/types';
import { TSearchTool } from './types';
import { ToolProps } from '../AbstractTool/types';

class SearchTool extends AbstractTool implements TSearchTool {
  static result = 'search';

  constructor(props: ToolProps) {
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

  result = (): LayerType => {
    return 'search';
  };

  enable = (): void => {
    this._redrawSidebar(this.result());
  };

  /**
   * append marker on map with given latlng
   */
  static putMarkerOnMap = (
    featureGroup: FeatureGroup,
    latlng: LatLng,
    popup: string,
    iconUrl: string,
    connectClick = false,
  ): DrawnObject => {
    const additionalOpts = { iconUrl: iconUrl || ICON_SRCS[0], connectClick };
    const icon = new L.Icon({
      ...iconStarter,
      ...additionalOpts,
    });

    const marker = new (L.Marker as any).Touch(latlng, { icon });
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
   */
  static geoSearch = async (
    featureGroup: FeatureGroup,
    query = '',
  ): Promise<LooseObject[] | undefined> => {
    if (!query) return;

    // setup
    const provider = new OpenStreetMapProvider();

    // search
    const results = await provider.search({ query });

    return results;
  };
}

export default SearchTool;
