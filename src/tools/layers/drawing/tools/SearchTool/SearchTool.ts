import L, { FeatureGroup, LatLng } from "leaflet";
import "leaflet-path-drag";
import "leaflet-path-transform";
import "leaflet-draw";

import { OpenStreetMapProvider } from "leaflet-geosearch";

import { AbstractTool } from "../AbstractTool";
import { iconStarter, ICON_SRCS } from "../../util/constants";
import { DrawnObject, LayerType, LooseObject } from "../../model/types";
import { TSearchTool } from "./types";
import { ToolProps } from "../AbstractTool/types";

class SearchTool extends AbstractTool implements TSearchTool {
  static result = "search";

  constructor(props: ToolProps) {
    super(props);
  }

  public static NAME(): string {
    return "search-drawing-tool";
  }

  public getName(): string {
    return SearchTool.NAME();
  }

  public getIconName(): string {
    return "fa fa-search";
  }

  public getTitle(): string {
    return "Search drawing tool";
  }

  public result = (): LayerType => {
    return "search";
  };

  public enable = (): void => {
    this._redrawSidebar(this.result());
  };

  /**
   * append marker on map with given latlng
   */
  public static putMarkerOnMap = (
    featureGroup: FeatureGroup,
    latlng: LatLng,
    popup: string,
    iconUrl: string,
    connectClick = false
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

    marker.layerType = "marker";
    featureGroup.addLayer(marker);
    // map.fire(L.Draw.Event.CREATED, { layer: marker, layerType: 'marker' });
    return marker;
  };

  /**
   * sends request to OSM with given query
   */
  public static geoSearch = async (
    featureGroup: FeatureGroup,
    query = ""
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
