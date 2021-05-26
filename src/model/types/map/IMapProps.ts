import { IMapObjectProps, IMapObjectInitProps } from "../object/IMapObjectProps";
import IMapTemplates from "./IMapTemplates";
import IMapGlobals from "./IMapGlobals";
import IMapDataManager from "../data/IMapDataManager";
import IMapToolsManager from "../tool/IMapToolsManager";
import IMapConfig from "./IMapConfig";
import IMapConfigManager from "../config/IMapConfigManager";

/**
 * This type provides the specification of the map props model.
 * 
 * @author Jiri Hynek
 */
type IMapProps = IMapObjectProps & {
    templates: IMapTemplates | undefined;
    globals: IMapGlobals | undefined;
    data: IMapDataManager | undefined;
    tools: IMapToolsManager | undefined;
    // TODO: specify the types
    centroids: unknown;
    polygons: unknown;
}

/**
 * This type provides the specification of the map object props model used in its initialization.
 * 
 * @author Jiri Hynek
 */
type IMapInitProps<TConfig extends IMapConfig = IMapConfig> = IMapObjectInitProps<TConfig> & {
    configManager : IMapConfigManager;
}
export type { IMapProps, IMapInitProps };