import IGeoData from "../geodata/IGeoData";
import IGeoDataFactory from "../geodata/IGeoDataFactory";
import IGeoDataManager from "../geodata/IGeoDataManager";
import IMap from "../map/IMap";
import IMapAggregationFunctionFactory from "../aggregation/IMapAggregationFunctionFactory";
import IMapConfigManagerFactory from "../config/IMapConfigManagerFactory";
import IMapDataManagerFactory from "../data/IMapDataManagerFactory";
import IMapDimension from "../dimension/IMapDimension";
import IMapDomain from "../domain/IMapDomain";
import IMapDomainManager from "../domain/IMapDomainManager";
import IMapDomainManagerFactory from "../domain/IMapDomainManagerFactory";
import IMapEventFactory from "../event/IMapEventFactory";
import IMapObject from "../object/IMapObject";
import IMapObjectsManager from "../object/IMapObjectsManager";
import { IMapProps } from "../map/IMapProps";
import IMapTool from "../tool/IMapTool";
import IMapToolsManager from "../tool/IMapToolsManager";

/**
 * API for the map.
 * 
 * @author Jiri Hynek
 */
type IMapAPI = {
    getType: () => string,
    createMap: (props: IMapProps) => IMap,
    getMapAggregationFunctionFactory: () => IMapAggregationFunctionFactory,
    getMapConfigManagerFactory: () => IMapConfigManagerFactory,
    getMapDataManagerFactory: () => IMapDataManagerFactory,
    getMapDomainManagerFactory: () => IMapDomainManagerFactory,
    getMapEventFactory: () => IMapEventFactory,
    getGeoDataManager: (geoDataArray: IGeoData[]) => IGeoDataManager,
    getGeoDataFactory: () => IGeoDataFactory,
    createMapDimension: <T extends IMapDomain>(name: string, domainManager: IMapDomainManager<T>, dataDomain: T | undefined) => IMapDimension<T>,
    createMapObjectsManager: <T extends IMapObject>(objects: T[] | undefined) => IMapObjectsManager<T>
    createMapToolsManager: <T extends IMapTool>(tools: T[]) => IMapToolsManager
}
export default IMapAPI;