import MapFiltersManager from "./internal/filter/basic/MapFiltersManager";
import EqFilterOperation from "./internal/filter/custom/EqFilterOperation";
import NeqFilterOperation from "./internal/filter/custom/NeqFilterOperation";
import RegFilterOperation from "./internal/filter/custom/RegFilterOperation";
import FiltersTool from "./internal/tool/FiltersTool";
import FiltersToolDefaults from "./internal/tool/FiltersToolDefaults";
import IMapFiltersManager from "./types/filter/IMapFilterManager";
import IMapFilterOperation from "./types/filter/IMapFilterOperation";
import IFiltersTool from "./types/tool/IFiltersTool";
import IFiltersToolProps from "./types/tool/IFiltersToolProps";

export const GeovistoFiltersTool: {
    getType: () => string,
    createTool: (props: IFiltersToolProps | undefined) => IFiltersTool
    createFiltersManager: (filterOperations: IMapFilterOperation[]) => IMapFiltersManager,
    createFilterOperationEq: () => IMapFilterOperation,
    createFilterOperationNeq: () => IMapFilterOperation,
    createFilterOperationReg: () => IMapFilterOperation
} = {
    getType: () => FiltersToolDefaults.TYPE,
    createTool: (props) => new FiltersTool(props),
    createFiltersManager: (filterOperations) => new MapFiltersManager(filterOperations),
    createFilterOperationEq: () => new EqFilterOperation(),
    createFilterOperationNeq: () => new NeqFilterOperation(),
    createFilterOperationReg: () => new RegFilterOperation()
};