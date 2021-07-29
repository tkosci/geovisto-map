// Geovisto core
import {
    MapToolDefaults
} from "../../../../../index.core";

import IMapSelection from "../../types/selection/IMapSelection";
import ISelectionToolConfig from "../../types/tool/ISelectionToolConfig";
import ISelectionToolDefaults from "../../types/tool/ISelectionToolDefaults";

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
     * It returns the label of the tool.
     */
    public getLabel(): string {
        return "Selection";
    }

    /**
     * It returns the icon of the tool.
     */
    public getIcon(): string {
        return '<i class="fa fa-file"></i>';
    }

    /**
     * It returns default map selection.
     */
    public getSelection(): IMapSelection | null {
        return null;
    }
}
export default SelectionToolDefaults;