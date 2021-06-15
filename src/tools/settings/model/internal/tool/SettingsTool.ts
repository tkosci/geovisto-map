import MapTool from "../../../../../model/internal/tool/MapTool";
import ISettingsTool from "../../types/tool/ISettingsTool";
import ISettingsToolProps from "../../types/tool/ISettingsToolProps";
import SettingsToolDefaults from "./SettingsToolDefaults";
import SettingsToolState from "./SettingsToolState";
import SettingsToolMapForm from "../form/SettingsToolMapForm";
import ISettingsToolState from "../../types/tool/ISettingsToolState";
import ISettingsToolDefaults from "../../types/tool/ISettingsToolDefaults";
import { IMapToolInitProps } from "../../../../../model/types/tool/IMapToolProps";
import IMapFormControl from "../../../../../model/types/form/IMapFormControl";
import IMapForm from "../../../../../model/types/form/IMapForm";
import ISettingsToolConfig from "../../types/tool/ISettingsToolConfig";

/**
 * This class represents settings tools. It provides empty sidebar which can be used be other tools via tab fragments.
 * 
 * @author Jiri Hynek
 */
class SettingsTool extends MapTool implements ISettingsTool, IMapFormControl {
    
    /**
     * TODO: move to the state
     */
    private sidebarTab!: IMapForm;

    /**
     * It creates a new tool with respect to the props.
     * 
     * @param props 
     */
    public constructor(props: ISettingsToolProps | undefined) {
        super(props);
    }

    /**
     * It creates a copy of the uninitialized tool.
     */
    public copy(): ISettingsTool {
        return new SettingsTool(this.getProps());
    }

    /**
     * It returns the props given by the programmer.
     */
    public getProps(): ISettingsToolProps {
        return <ISettingsToolProps> super.getProps();
    }
    
    /**
     * It returns default values of the settings tool.
     */
    public getDefaults(): ISettingsToolDefaults {
        return <ISettingsToolDefaults> super.getDefaults();
    }

    /**
     * It creates new defaults of the tool.
     */
    public createDefaults(): ISettingsToolDefaults {
        return new SettingsToolDefaults();
    }

    /**
     * It returns the settings tool state.
     */
    public getState(): ISettingsToolState {
        return <ISettingsToolState> super.getState();
    }

    /**
     * It creates the tool state.
     */
    public createState(): ISettingsToolState {
        return new SettingsToolState(this);
    }

    /**
     * Overrides the super method.
     * 
     * @param initProps
     */
    public initialize(initProps: IMapToolInitProps<ISettingsToolConfig>): this {
        return super.initialize(initProps);
    }

    /**
     * It returns a sidebar tab with respect to the configuration.
     */
    public getMapForm(): IMapForm {
        if(this.sidebarTab == undefined) {
            this.sidebarTab = this.createMapForm();
        }
        return this.sidebarTab;
    }

    /**
     * It creates new tab control.
     */
    protected createMapForm(): IMapForm {
        // override if needed
        return new SettingsToolMapForm(this);
    }
}
export default SettingsTool;