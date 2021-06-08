import IMapSelection from "../../types/selection/IMapSelection";
import MapToolDefaults from "../../../../../model/internal/tool/MapToolDefaults";
import ISelectionToolDefaults from "../../types/tool/ISelectionToolDefaults";
import ISelectionToolConfig from "../../types/tool/ISelectionToolConfig";

/**
 * This class provide functions which return the default state values.
 * 
 * @author Jiri Hynek
 */
class SelectionToolDefaults extends MapToolDefaults implements ISelectionToolDefaults {

    /**
     * It returns the default config.
     */
    public getConfig(): ISelectionToolConfig {
        const config = <ISelectionToolConfig> super.getConfig();
        config.selection = undefined;
        return config;
    }

    /**
     * Only one selection tool should be present in the Geovisto map.
     */
    public isSingleton(): boolean {
       return true; 
    }

    /**
     * Static tool type constant.
     */
    public static TYPE = "geovisto-tool-selection";

    /**
     * It returns a unique string of the tool type.
     */
    public getType(): string {
        return SelectionToolDefaults.TYPE;
    }

    /**
     * It returns default map selection.
     */
    public getSelection(): IMapSelection | null {
        return null;
    }
}
export default SelectionToolDefaults;