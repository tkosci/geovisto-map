import 'font-awesome/css/font-awesome.min.css';
import {
    IMap,
    IMapAggregationFunctionFactory,
    IMapConfigManagerFactory,
    IMapDataManagerFactory,
    IMapDimension,
    IMapDomain,
    IMapDomainManager,
    IMapDomainManagerFactory,
    IMapEventFactory,
    IMapObject,
    IMapObjectsManager,
    IMapProps,
    IMapTool,
    IMapToolsManager,
    GeovistoMap,
    MapAggregationFunctionFactory,
    MapConfigManagerFactory,
    MapDataManagerFactory,
    MapDomainManagerFactory,
    MapDimension,
    MapEventFactory,
    MapObjectsManager,
    MapToolsManager
} from '.';

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
    getType: () => "geovisto-map",
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

// MODEL / TYPES

// aggregation
export type { default as IMapAggregationBucket } from './model/types/aggregation/IMapAggregationBucket';
export type { default as IMapAggregationFunction } from './model/types/aggregation/IMapAggregationFunction';
export type { default as IMapAggregationFunctionFactory } from './model/types/aggregation/IMapAggregationFunctionFactory';

// config
export type { default as IMapConfigManager } from './model/types/config/IMapConfigManager';
export type { default as IMapConfigManagerFactory } from './model/types/config/IMapConfigManagerFactory';

// data
export type { default as IMapData } from './model/types/data/IMapData';
export type { default as IMapDataDomain } from './model/types/data/IMapDataDomain';
export type { default as IMapDataManager } from './model/types/data/IMapDataManager';
export type { default as IMapDataManagerFactory } from './model/types/data/IMapDataManagerFactory';
export type { default as IMapDataRecord } from './model/types/data/IMapDataRecord';
export type { default as IMapDataRecordItem } from './model/types/data/IMapDataRecordItem';

// dimension
export type { default as IMapDimension } from './model/types/dimension/IMapDimension';

// domain
export type { default as IMapDomain } from './model/types/domain/IMapDomain';
export type { default as IMapDomainArrayManager } from './model/types/domain/IMapDomainArrayManager';
export type { default as IMapDomainManager } from './model/types/domain/IMapDomainManager';
export type { default as IMapDomainManagerFactory } from './model/types/domain/IMapDomainManagerFactory';

// event
export type { default as IMapEvent } from './model/types/event/IMapEvent';
export type { default as IMapEventFactory } from './model/types/event/IMapEventFactory';
export type { default as IMapChangeEvent } from './model/types/event/IMapChangeEvent';

// inputs
export type { default as IMapFormInput } from './model/types/inputs/IMapFormInput';
export type { default as IMapFormInputFactory } from './model/types/inputs/IMapFormInputFactory';
export type { default as IMapFormInputProps } from './model/types/inputs/IMapFormInputProps';
export type { default as ISelectFormInputProps } from './model/types/inputs/basic/select/ISelectFormInputProps';
export type { default as ITextFormInputProps } from './model/types/inputs/basic/text/ITextFormInputProps';
export type { default as IFilterFormInputProps } from './model/types/inputs/filter/IFilterFormInputProps';
export type { default as IFilterFormInputValue } from './model/types/inputs/filter/IFilterFormInputValue';
export type { default as ILabeledAutocompleteFormInputProps } from './model/types/inputs/labeled/autocomplete/ILabeledAutocompleteFormInputProps';
export type { default as ILabeledSelectFormInputProps } from './model/types/inputs/labeled/select/ILabeledSelectFormInputProps';
export type { default as ILabeledTextFormInputProps } from './model/types/inputs/labeled/text/ILabeledTextFormInputProps';

// layer
export type { default as ILayerTool } from './model/types/layer/ILayerTool';
export type { ILayerToolConfig, ILayerToolDimensionsConfig } from './model/types/layer/ILayerToolConfig';
export type { default as ILayerToolDefaults } from './model/types/layer/ILayerToolDefaults';
export type { default as ILayerToolProps } from './model/types/layer/ILayerToolProps';
export type { default as ILayerToolState } from './model/types/layer/ILayerToolState';

// map
export type { default as IMap } from './model/types/map/IMap';
export type { default as IMapConfig } from './model/types/map/IMapConfig';
export type { default as IMapDefaults } from './model/types/map/IMapDefaults';
export type { default as IMapGlobals } from './model/types/map/IMapGlobals';
export type { IMapProps, IMapInitProps } from './model/types/map/IMapProps';
export type { default as IMapState } from './model/types/map/IMapState';
export type { default as IMapTemplates } from './model/types/map/IMapTemplates';

// object
export type { default as IMapObject } from './model/types/object/IMapObject';
export type { default as IMapObjectConfig } from './model/types/object/IMapObjectConfig';
export type { default as IMapObjectDefaults } from './model/types/object/IMapObjectDefaults';
export type { IMapObjectProps, IMapObjectInitProps } from './model/types/object/IMapObjectProps';
export type { default as IMapObjectsManager } from './model/types/object/IMapObjectsManager';
export type { default as IMapObjectState } from './model/types/object/IMapObjectState';

// tool
export type { default as IMapTool } from './model/types/tool/IMapTool';
export type { default as IMapToolConfig } from './model/types/tool/IMapToolConfig';
export type { default as IMapToolDefaults } from './model/types/tool/IMapToolDefaults';
export type { IMapToolProps, IMapToolInitProps } from './model/types/tool/IMapToolProps';
export type { default as IMapToolsManager } from './model/types/tool/IMapToolsManager';
export type { default as IMapToolState } from './model/types/tool/IMapToolState';

// MODEL / INTERNAL

// aggregation
export { default as MapAggregationFunctionFactory } from './model/internal/aggregation/MapAggregationFunctionFactory';
export { default as CountAggregationFunction } from './model/internal/aggregation/basic/CountAggregationFunction';
export { default as SumAggregationFunction } from './model/internal/aggregation/basic/SumAggregationFunction';
export { default as MapAggregationFunction } from './model/internal/aggregation/generic/MapAggregationFunction';

// config
export { default as MapConfigManagerFactory } from './model/internal/config/MapConfigManagerFactory';
export { default as AbstractMapConfigManager } from './model/internal/config/abstract/AbstractMapConfigManager';
export { default as MapConfigManager } from './model/internal/config/basic/MapConfigManager';

// data
export { default as MapDataManagerFactory } from './model/internal/data/MapDataManagerFactory';
export { default as AbstractMapDataDomain } from './model/internal/data/abstract/AbstractMapDataDomain';
export { default as AbstractMapDataManager } from './model/internal/data/abstract/AbstractMapDataManager';
export { default as JsonMapDataDomain } from './model/internal/data/json/JsonMapDataDomain';
export { default as JsonMapDataManager } from './model/internal/data/json/JsonMapDataManager';

// dimension
export { default as MapDimension } from './model/internal/dimension/MapDimension';

// domain
export { default as MapDomainManagerFactory } from './model/internal/domain/MapDomainManagerFactory';
export { default as AbstractMapDomain } from './model/internal/domain/abstract/AbstractMapDomain';
export { default as MapDomain } from './model/internal/domain/generic/MapDomain';
export { default as MapDomainArrayManager } from './model/internal/domain/generic/MapDomainArrayManager';

// event
export { default as MapEventFactory } from './model/internal/event/MapEventFactory';
export { default as DataChangeEvent } from './model/internal/event/data/DataChangeEvent';
export { default as MapEvent } from './model/internal/event/generic/MapEvent';
export { default as MapChangeEvent } from './model/internal/event/generic/MapChangeEvent';

// inputs
export { default as MapFormInputFactory } from './model/internal/inputs/MapFormInputFactory';
export { default as AbstractMapFormInput } from './model/internal/inputs/abstract/AbstractMapFormInput';
export { default as SelectFormInput } from './model/internal/inputs/basic/select/SelectFormInput';
export { default as TextFormInput } from './model/internal/inputs/basic/text/TextFormInput';
export { default as FilterAutocompleteFormInput } from './model/internal/inputs/filter/autocomplete/FilterAutocompleteFormInput';
export { default as FilterSelectFormInput } from './model/internal/inputs/filter/select/FilterSelectFormInput';
export { default as LabeledAutocompleteFormInput } from './model/internal/inputs/labeled/autocomplete/LabeledAutocompleteFormInput';
export { default as LabeledSelectFormInput } from './model/internal/inputs/labeled/select/LabeledSelectFormInput';
export { default as LabeledTextFormInput } from './model/internal/inputs/labeled/text/LabeledTextFormInput';

// layer
export type { default as AbstractLayerTool } from './model/internal/layer/AbstractLayerTool';
export type { default as LayerToolDefaults } from './model/internal/layer/LayerToolDefaults';
export type { default as LayerToolState } from './model/internal/layer/LayerToolState';

// map
export { default as GeovistoMap } from './model/internal/map/GeovistoMap';
export { default as GeovistoMapDefaults } from './model/internal/map/GeovistoMapDefaults';
export { default as GeovistoMapState } from './model/internal/map/GeovistoMapState';

// object
export { default as MapObject } from './model/internal/object/MapObject';
export { default as MapObjectDefaults } from './model/internal/object/MapObjectDefaults';
export { default as MapObjectsManager } from './model/internal/object/MapObjectsManager';
export { default as MapObjectState } from './model/internal/object/MapObjectState';

// tool
export { default as MapTool } from './model/internal/tool/MapTool';
export { default as MapToolDefaults } from './model/internal/tool/MapToolDefaults';
export { default as MapToolsManager } from './model/internal/tool/MapToolsManager';
export { default as MapToolState } from './model/internal/tool/MapToolState';

// REACT MAP
export { default as ReactGeovistoMap } from './react/ReactGeovistoMap';

// TOOLS
// TODO: this should be removed in the future since the tools will be represented as standalone bundles
export * from './tools';
