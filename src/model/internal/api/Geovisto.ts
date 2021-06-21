import IMapAPI from '../../types/api/IMapAPI';
import IMapDomain from '../../types/domain/IMapDomain';
import IMapDomainManager from '../../types/domain/IMapDomainManager';
import IMapObject from '../../types/object/IMapObject';
import { IMapProps } from '../../types/map/IMapProps';
import IMapTool from '../../types/tool/IMapTool';
import GeoDataFactory from '../geodata/GeoDataFactory';
import GeoDataManager from '../geodata/GeoDataManager';
import GeovistoMap from '../map/GeovistoMap';
import GeovistoMapDefaults from '../map/GeovistoMapDefaults';
import MapAggregationFunctionFactory from '../aggregation/MapAggregationFunctionFactory';
import MapConfigManagerFactory from '../config/MapConfigManagerFactory';
import MapDataManagerFactory from '../data/MapDataManagerFactory';
import MapDimension from '../dimension/MapDimension';
import MapDomainManagerFactory from '../domain/MapDomainManagerFactory';
import MapEventFactory from '../event/MapEventFactory';
import MapObjectsManager from '../object/MapObjectsManager';
import MapToolsManager from '../tool/MapToolsManager';

export const Geovisto: IMapAPI = {
    getType: () => GeovistoMapDefaults.TYPE,
    createMap: (props: IMapProps) => new GeovistoMap(props),
    getMapAggregationFunctionFactory: () => new MapAggregationFunctionFactory(),
    getMapConfigManagerFactory: () => new MapConfigManagerFactory(),
    getMapDataManagerFactory: () => new MapDataManagerFactory(),
    getMapDomainManagerFactory: () => new MapDomainManagerFactory(),
    getMapEventFactory: () => new MapEventFactory(),
    getGeoDataManager: (geoDataArray) => new GeoDataManager(geoDataArray),
    getGeoDataFactory: () => new GeoDataFactory(),
    createMapDimension: <T extends IMapDomain>(name: string, domainManager: IMapDomainManager<T>, dataDomain: T | undefined) => new MapDimension<T>(name, domainManager, dataDomain),
    createMapObjectsManager: <T extends IMapObject>(objects: T[] | undefined) => new MapObjectsManager<T>(objects),
    createMapToolsManager: (tools: IMapTool[]) => new MapToolsManager(tools),
};