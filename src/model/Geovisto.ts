import MapAggregationFunctionFactory from './internal/aggregation/MapAggregationFunctionFactory';
import MapConfigManagerFactory from './internal/config/MapConfigManagerFactory';
import MapDataManagerFactory from './internal/data/MapDataManagerFactory';
import MapDimension from './internal/dimension/MapDimension';
import MapDomainManagerFactory from './internal/domain/MapDomainManagerFactory';
import MapEventFactory from './internal/event/MapEventFactory';
import GeovistoMap from './internal/map/GeovistoMap';
import GeovistoMapDefaults from './internal/map/GeovistoMapDefaults';
import MapObjectsManager from './internal/object/MapObjectsManager';
import MapToolsManager from './internal/tool/MapToolsManager';
import IMapAggregationFunctionFactory from './types/aggregation/IMapAggregationFunctionFactory';
import IMapConfigManagerFactory from './types/config/IMapConfigManagerFactory';
import IMapDataManagerFactory from './types/data/IMapDataManagerFactory';
import IMapDimension from './types/dimension/IMapDimension';
import IMapDomain from './types/domain/IMapDomain';
import IMapDomainManager from './types/domain/IMapDomainManager';
import IMapDomainManagerFactory from './types/domain/IMapDomainManagerFactory';
import IMapEventFactory from './types/event/IMapEventFactory';
import IMap from './types/map/IMap';
import { IMapProps } from './types/map/IMapProps';
import IMapObject from './types/object/IMapObject';
import IMapObjectsManager from './types/object/IMapObjectsManager';
import IMapTool from './types/tool/IMapTool';
import IMapToolsManager from './types/tool/IMapToolsManager';

export const Geovisto: {
    getType: () => string,
    getMapAggregationFunctionFactory: () => IMapAggregationFunctionFactory,
    getMapConfigManagerFactory: () => IMapConfigManagerFactory,
    getMapDataManagerFactory: () => IMapDataManagerFactory,
    getMapDomainManagerFactory: () => IMapDomainManagerFactory,
    getMapEventFactory: () => IMapEventFactory,
    createMap: (props: IMapProps) => IMap,
    createMapDimension: <T extends IMapDomain>(name: string, domainManager: IMapDomainManager<T>, dataDomain: T | undefined) => IMapDimension<T>,
    createMapObjectsManager: <T extends IMapObject>(objects: T[] | undefined) => IMapObjectsManager<T>
    createMapToolsManager: <T extends IMapTool>(tools: T[]) => IMapToolsManager
} = {
    getType: () => GeovistoMapDefaults.TYPE,
    getMapAggregationFunctionFactory: () => new MapAggregationFunctionFactory(),
    getMapConfigManagerFactory: () => new MapConfigManagerFactory(),
    getMapDataManagerFactory: () => new MapDataManagerFactory(),
    getMapDomainManagerFactory: () => new MapDomainManagerFactory(),
    getMapEventFactory: () => new MapEventFactory(),
    createMap: (props) => new GeovistoMap(props),
    createMapDimension: <T extends IMapDomain>(name: string, domainManager: IMapDomainManager<T>, dataDomain: T | undefined) => new MapDimension<T>(name, domainManager, dataDomain),
    createMapObjectsManager: <T extends IMapObject>(objects: T[] | undefined) => new MapObjectsManager<T>(objects),
    createMapToolsManager: (tools: IMapTool[]) => new MapToolsManager(tools),
};