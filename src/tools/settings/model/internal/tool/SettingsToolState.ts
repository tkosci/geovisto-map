import MapToolState from "../../../../../model/internal/tool/MapToolState";
import ISettingsTool from "../../types/tool/ISettingsTool";
import ISettingsToolState from "../../types/tool/ISettingsToolState";
import ISettingsToolConfig from "../../types/tool/ISettingsToolConfig";
import ISettingsToolDefaults from "../../types/tool/ISettingsToolDefaults";
import ISettingsToolProps from "../../types/tool/ISettingsToolProps";
import { IMapToolInitProps } from "../../../../../model/types/tool/IMapToolProps";

/**
 * This class provide functions for using selections.
 * 
 * @author Jiri Hynek
 */
class SettingsToolState extends MapToolState implements ISettingsToolState {

    /**
     * It creates a tool state.
     */
    public constructor(tool: ISettingsTool) {
        super(tool);
    }

    /**
     * It resets the state with respect to the initial props.
     * 
     * @param defaults 
     * @param props 
     * @param initProps 
     */
    public initialize(defaults: ISettingsToolDefaults, props: ISettingsToolProps, initProps: IMapToolInitProps<ISettingsToolConfig>): void {
        // initialize super props
        super.initialize(defaults, props, initProps);
    }

    /**
     * The metod takes config and deserializes the values.
     * 
     * @param config 
     */
    public deserialize(config: ISettingsToolConfig): void {
        super.deserialize(config);
    }

    /**
     * The method serializes the tool state. Optionally, defaults can be set if property is undefined.
     * 
     * @param defaults
     */
    public serialize(defaults: ISettingsToolDefaults | undefined): ISettingsToolConfig {
        return super.serialize(defaults);
    }
}
export default SettingsToolState;