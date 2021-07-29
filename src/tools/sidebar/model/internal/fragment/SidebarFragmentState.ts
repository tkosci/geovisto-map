// Geovisto core
import {
    IMapTool,
    MapObjectState
} from "../../../../../index.core";

import ISidebarFragment from "../../types/fragment/ISidebarFragment";
import ISidebarFragmentConfig from "../../types/fragment/ISidebarFragmentConfig";
import ISidebarFragmentDefaults from "../../types/fragment/ISidebarFragmentDefaults";
import { ISidebarFragmentProps, ISidebarFragmentInitProps } from "../../types/fragment/ISidebarFragmentProps";
import ISidebarFragmentState from "../../types/fragment/ISidebarFragmentState";
import ISidebarTab from "../../types/tab/ISidebarTab";
/**
 * This class manages the state of the sidebar fragment.
 * It wraps the state since the sidebar fragment can work with state objects which needs to be explicitly serialized.
 * 
 * @author Jiri Hynek
 */
class SidebarFragmentState extends MapObjectState implements ISidebarFragmentState {
    
    private enabled!: boolean;
    
    private tool!: IMapTool;
    
    private sidebarTab!: ISidebarTab;
    
    private content: HTMLElement | null;

    /**
     * It creates a sidebar fragment state.
     * 
     * @param sidebarFragment 
     */
    public constructor(sidebarFragment: ISidebarFragment) {
        super(sidebarFragment);

        this.content = null;
    }

    /**
     * It resets state with respect to initial props.
     */
    public initialize(defaults: ISidebarFragmentDefaults, props: ISidebarFragmentProps, initProps: ISidebarFragmentInitProps<ISidebarFragmentConfig>): void {
        this.setTool(initProps.tool);
        this.setSidebarTab(initProps.sidebarTab);

        // set remaining properties if not set
        this.setEnabled(props.enabled == undefined ? defaults.isEnabled() : props.enabled);

        this.content = null;

        // set super props
        super.initialize(defaults, props, initProps);
    }

    /**
     * The metod takes config and deserializes the values.
     * 
     * @param config 
     */
    public deserialize(config: ISidebarFragmentConfig): void {
        if(config.enabled != undefined) this.setEnabled(config.enabled);
    }

    /**
     * The method serializes the sidebar tab fragment configuration.
     * Optionally, a serialized value can be let undefined if it equals the default value.
     * 
     * @param defaults 
     */
    public serialize(defaults: ISidebarFragmentDefaults | undefined): ISidebarFragmentConfig {
        return {
            id: undefined,
            type: undefined,
            tool: this.getTool()?.getId(),
            enabled: defaults && this.isEnabled() == defaults.isEnabled() ? undefined : this.isEnabled(),
        };
    }

    /**
     * It returns the tool property of the sidebar tab fragment state.
     */
    public getTool(): IMapTool {
        return this.tool;
    }

    /**
     * It sets the tool property of the sidebar tab fragment state.
     * 
     * @param tool 
     */
    protected setTool(tool: IMapTool): void {
       this.tool = tool;
    }

    /**
     * It returns the enabled property of the sidebar fragment state.
     */
    public isEnabled(): boolean {
        return this.enabled;
    }

    /**
     * It sets the enabled property of the sidebar fragment state.
     * 
     * @param enabled 
     */
    public setEnabled(enabled: boolean): void {
       this.enabled = enabled;
    }

    /**
     * It returns the sidebar tab property of the sidebar fragment control state.
     */
    public getSidebarTab(): ISidebarTab {
        return this.sidebarTab;
    }

    /**
     * It sets the sidebar tab property of the sidebar fragment state.
     * 
     * @param sidebarTab 
     */
    public setSidebarTab(sidebarTab: ISidebarTab): void {
       this.sidebarTab = sidebarTab;
    }

    /**
     * It returns the content property of the sidebar fragment state.
     */
    public getContent(): HTMLElement | null {
        return this.content;
    }

    /**
     * It sets the content property of the sidebar tab control state.
     * 
     * @param content 
     */
    public setContent(content: HTMLElement): void {
       this.content = content;
    }
}
export default SidebarFragmentState;