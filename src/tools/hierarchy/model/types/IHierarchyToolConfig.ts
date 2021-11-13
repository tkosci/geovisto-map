import {
    IMapToolConfig
} from "../../../../index.core";

type IHierarchyToolConfig = IMapToolConfig & {
    HierarchyConf?: {
        id: string,
        zoomLevel: number,
        childs: string[],
    }[];
}
export default IHierarchyToolConfig;