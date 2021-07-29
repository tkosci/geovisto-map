// Geovisto core
import {
    IMapTool,
    MapObjectState
} from "../../../../../index.core";

import ISidebarFragment from "../../types/fragment/ISidebarFragment";
import ISidebarTab from "../../types/tab/ISidebarTab";
import ISidebarTabConfig from "../../types/tab/ISidebarTabConfig";
import ISidebarTabDefaults from "../../types/tab/ISidebarTabDefaults";
import { ISidebarTabProps, ISidebarTabInitProps } from "../../types/tab/ISidebarTabProps";
import ISidebarTabState from "../../types/tab/ISidebarTabState";
import ISidebarTool from "../../types/tool/ISidebarTool";
import DummyTabTool from "../dummy/DummyTabTool";

/**
 * This class manages the state of the sidebar tab.
 * It wraps the state since the sidebar tab can work with state objects which needs to be explicitly serialized.
 * 
 * @author Jiri Hynek
 */
class SidebarTabState extends MapObjectState implements ISidebarTabState {
    
    private tool!: IMapTool;
    
    private enabled!: boolean;

    private name!: string;

    private icon!: string;

    private checkButton!: boolean;
    
    private sidebar!: ISidebarTool;
    
    private fragments?: ISidebarFragment[];
    
    private content: HTMLElement | null;

    /**
     * It creates a sidebar tab state.
     * 
     * @param sidebarTab 
     */
    public constructor(sidebarTab: ISidebarTab) {
        super(sidebarTab);

        this.content = null;
    }

    /**
     * It resets state with respect to initial props.
     */
    public initialize(defaults: ISidebarTabDefaults, props: ISidebarTabProps, initProps: ISidebarTabInitProps<ISidebarTabConfig>): void {
        this.setTool(initProps.tool);
        this.setSidebarTool(initProps.sidebarTool);
        
        // set remaining properties if not set
        this.setName(props.name == undefined ? defaults.getName() : props.name);
        this.setIcon(props.icon == undefined ? defaults.getIcon() : props.icon);
        this.setCheckButton(props.checkButton == undefined ? defaults.hasCheckButton() : props.checkButton);
        this.setEnabled(props.enabled == undefined ? defaults.isEnabled() : props.enabled);

        this.fragments = undefined;
        this.content = null;

        // set super props
        super.initialize(defaults, props, initProps);
    }

    /**
     * The function takes config and deserializes the values.
     * 
     * @param config 
     */
    public deserialize(config: ISidebarTabConfig): void {
        if(config.enabled != undefined) this.setEnabled(config.enabled);
        if(config.name != undefined) this.setName(config.name);
        if(config.icon != undefined) this.setIcon(config.icon);
        if(config.checkButton != undefined) this.setCheckButton(config.checkButton);
    }

    /**
     * The method serializes the sidebar tab control configuration.
     * Optionally, a serialized value can be let undefined if it equals the default value.
     * 
     * @param defaults 
     */
    public serialize(defaults: ISidebarTabDefaults | undefined): ISidebarTabConfig {
        // do not serialize id and type - it is not necessary for deserialization

        const config: ISidebarTabConfig = {
            type: undefined,
            id: undefined,
            tool: this.getTool() instanceof DummyTabTool ? undefined : this.getTool()?.getId(),
            enabled: defaults && this.isEnabled() == defaults.isEnabled() ? undefined : this.isEnabled(),
            name: defaults && this.getName() == defaults.getName() ? undefined : this.getName(),
            icon: defaults && this.getIcon() == defaults.getIcon() ? undefined : this.getIcon(),
            checkButton: defaults && this.hasCheckButton() == defaults.isEnabled() ? undefined : this.hasCheckButton(),
            fragments: undefined
        };

        // serialize tab fragments
        const fragments : ISidebarFragment[] | undefined = this.getFragments();
        if(fragments) {
            config.fragments = [];
            for(let i = 0; i != fragments.length; i++) {
                config.fragments.push(fragments[i].getState().serialize(defaults ? fragments[i].getDefaults() : undefined));
            }
        }

        return config;
    }

    /**
     * It returns the tool property of the sidebar tab state.
     */
    public getTool(): IMapTool {
        return this.tool;
    }

    /**
     * It sets the tool property of the sidebar tab state.
     * 
     * @param tool 
     */
    public setTool(tool: IMapTool): void {
       this.tool = tool;
    }

    /**
     * It returns the enabled property of the sidebar tab state.
     */
    public isEnabled(): boolean {
        return this.enabled;
    }

    /**
     * It sets the enabled property of the sidebar tab state.
     * 
     * @param enabled 
     */
    public setEnabled(enabled: boolean): void {
       this.enabled = enabled;
    }

    /**
     * It returns the name property of the sidebar tab state.
     */
    public getName(): string {
        return this.name;
    }

    /**
     * It sets the name property of the sidebar tab state.
     * 
     * @param name 
     */
    public setName(name: string): void {
       this.name = name;
    }

    /**
     * It returns the icon property of the sidebar tab state.
     */
    public getIcon(): string {
        return this.icon;
    }

    /**
     * It sets the icon property of the sidebar tab state.
     * 
     * @param icon
     */
    public setIcon(icon: string): void {
       this.icon = icon;
    }

    /**
     * It returns the checkButton property of the sidebar tab state.
     */
    public hasCheckButton(): boolean {
        return this.checkButton;
    }

    /**
     * It sets the checkButton property of the sidebar tab state.
     * 
     * @param checkButton 
     */
    public setCheckButton(checkButton: boolean): void {
       this.checkButton = checkButton;
    }

    /**
     * It returns the sidebar property of the sidebar tab state.
     */
    public getSidebarTool(): ISidebarTool {
        return this.sidebar;
    }

    /**
     * It sets the sidebar property of the sidebar tab state.
     * 
     * @param sidebar 
     */
    public setSidebarTool(sidebar: ISidebarTool): void {
        this.sidebar = (this.sidebar == undefined) ? sidebar : this.sidebar;
    }

    /**
     * It returns the HTML content property of the sidebar tab state.
     */
    public getContent(): HTMLElement | null {
        return this.content;
    }

    /**
     * It sets the HTML content property of the sidebar tab state.
     * 
     * @param content 
     */
    public setContent(content: HTMLElement): void {
       this.content = content;
    }

    /**
     * It returns the fragments property of the sidebar tab state.
     */
    public getFragments(): ISidebarFragment[] | undefined {
        return this.fragments;
    }

    /**
     * It sets the fragments property of the sidebar tab state.
     * 
     * @param fragments 
     */
    public setFragments(fragments: ISidebarFragment[]): void {
        this.fragments = fragments;
    }
}
export default SidebarTabState;