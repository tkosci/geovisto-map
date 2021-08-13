import { DrawnObject, LooseObject } from './../../model/types/index';
import { TAbstractTool } from '../AbstractTool/types';
import { FeatureGroup, LatLng } from 'leaflet';

export interface TSearchTool extends TAbstractTool {
  putMarkerOnMap(
    featureGroup: FeatureGroup,
    latlng: LatLng,
    popup: string,
    iconUrl: string,
    connectClick: boolean,
  ): DrawnObject;
  geoSearch(featureGroup: FeatureGroup, query: string): Promise<LooseObject[] | undefined>;
}
