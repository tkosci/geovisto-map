import IFiltersTool from "./model/types/tool/IFiltersTool";
import IFiltersToolProps from "./model/types/tool/IFiltersToolProps";
import IMapFilterManager from "./model/types/filter/IMapFilterManager";
import IMapFilterOperation from "./model/types/filter/IMapFilterOperation";
import EqFilterOperation from "./model/internal/filter/custom/EqFilterOperation";
import FiltersTool from "./model/internal/tool/FiltersTool";
import FiltersToolDefaults from "./model/internal/tool/FiltersToolDefaults";
import MapFiltersManager from "./model/internal/filter/basic/MapFiltersManager";
import NeqFilterOperation from "./model/internal/filter/custom/NeqFilterOperation";
import RegFilterOperation from "./model/internal/filter/custom/RegFilterOperation";

export const GeovistoFiltersTool: {
    getType: () => string,
    createTool: (props?: IFiltersToolProps) => IFiltersTool
    createFiltersManager: (filterOperations: IMapFilterOperation[]) => IMapFilterManager,
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