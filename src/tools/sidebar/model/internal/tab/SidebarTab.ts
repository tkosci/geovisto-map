// d3
import {
    select as d3select
} from "d3";

//Leaflet
import {
    Control
} from "leaflet";

// Geovisto core
import {
    IMapFormControl,
    instanceOfMapForm,
    IMapTool,
    MapObject
} from "../../../../../index.core";

import ISidebarTab from "../../types/tab/ISidebarTab";
import ISidebarFragment from "../../types/fragment/ISidebarFragment";
import ISidebarFragmentConfig from "../../types/fragment/ISidebarFragmentConfig";
import ISidebarTabConfig from "../../types/tab/ISidebarTabConfig";
import ISidebarTabDefaults from "../../types/tab/ISidebarTabDefaults";
import ISidebarTabState from "../../types/tab/ISidebarTabState";
import { ISidebarTabProps, ISidebarTabInitProps } from "../../types/tab/ISidebarTabProps";
import SidebarFragment from "../fragment/SidebarFragment";
import SidebarTabDefaults from "./SidebarTabDefaults";
import SidebarTabState from "./SidebarTabState";

const C_sidebar_header_class = "leaflet-sidebar-header";
const C_sidebar_tab_content_class = "leaflet-sidebar-tab-content";
const C_enabled_class = "enabled";
const C_checked_class = "checked";

/**
 * This class provides controls for a sidebar tab.
 * It contains enable button which enables the sidebar and tool.
 *
 * This class is intended to be extended.
 *
 * @author Jiri Hynek
 */
class SidebarTab<T extends IMapTool & IMapFormControl> extends MapObject implements ISidebarTab {

    /**
     * It creates abstract sidebar tab with respect to the given props.
     * 
     * @param props 
     */
    public constructor(props?: ISidebarTabProps) {
        super(props);
    }

    /**
     * It returns the props given by the programmer.
     */
    public getProps(): ISidebarTabProps {
        return <ISidebarTabProps> super.getProps();
    }
    
    /**
     * It returns default values of the sidebar tab.
     */
    public getDefaults(): ISidebarTabDefaults {
        return <ISidebarTabDefaults> super.getDefaults();
    }

    /**
     * It creates new defaults of the sidebar tab.
     */
    protected createDefaults(): ISidebarTabDefaults {
        return <ISidebarTabDefaults> new SidebarTabDefaults();
    }

    /**
     * It returns the sidebar tab state.
     */
    public getState(): ISidebarTabState {
        return <ISidebarTabState> super.getState();
    }

    /**
     * It creates the sidebar tab state.
     */
    protected createState(): ISidebarTabState {
        return <ISidebarTabState> new SidebarTabState(this);
    }

    /**
     * Help function which returns the tool.
     */
    public getTool(): T {
        return <T> this.getState().getTool();
    }

    /**
     * Help function which returns sidebar fragmnets.
     */
    public getFragments(): ISidebarFragment[] | undefined {
        return this.getState().getFragments();
    }

    /**
     * It initializes the sidebar tab.
     *
     * @param initProps
     */
    public initialize(initProps: ISidebarTabInitProps): this {
        super.initialize(initProps);

        if(initProps.config) {
            this.initializeFragments(initProps.config);
        }

        return this;
    }

    /**
     * The function takes config and deserializes the tab fragments.
     * 
     * @param config 
     */
    protected initializeFragments(config: ISidebarTabConfig): void {
        // init help variables
        const fragments: ISidebarFragment[] = [];
        let fragment: ISidebarFragment;
        let fragmentTool: IMapTool | undefined;
        
        const propsFragments = this.getProps().fragments;

        const thisTool = this.getTool();
        if(thisTool) {
            const map = thisTool.getMap();
            if(map) {
                // process tab fragments
                if(config.fragments) {
                    let fragmentConfig: ISidebarFragmentConfig;
                    for(let i = 0; i != config.fragments.length; i++) {
                        fragmentConfig = config.fragments[i];
                        if(fragmentConfig.tool) {
                            fragmentTool = map.getState().getTools().getById(fragmentConfig.tool);
                            if(fragmentTool && instanceOfMapForm<IMapTool>(fragmentTool)) {
                                fragment = new SidebarFragment({
                                    id: undefined,
                                    enabled: undefined
                                });
                                fragment.initialize({ tool: fragmentTool, sidebarTab: this, config: fragmentConfig });
                                fragments.push(fragment);
                            }
                        }
                    }
                } else if(propsFragments) {
                    for(const [ toolId, fragment ] of propsFragments) {
                        fragmentTool = map.getState().getTools().getById(toolId);
                        if(fragmentTool && instanceOfMapForm<IMapTool>(fragmentTool)) {
                            fragment.initialize({ tool: fragmentTool, sidebarTab: this, config: undefined });
                            fragments.push(fragment);
                        }
                     }
                }
            }
        }

        this.getState().setFragments(fragments);
    }

    /**
     * Creates sidebar tab.
     */
    public create(): this {
        const state: ISidebarTabState = this.getState();
        const sidebar: Control.Sidebar | null = state.getSidebarTool().getState().getSidebar();
        if(sidebar && state.isEnabled()) {
            // render sidebar tab pane
            sidebar.addPanel(this.getTabStructure());

            // arrange DOM elements after they are rendered
            this.postCreate();
        }
        return this;
    }

    /**
     * It returns the sidebar tab structure defined with respect to the leaflet-sidebar-v2 plug-in.
     *
     * See: https://github.com/noerw/leaflet-sidebar-v2
     */
    protected getTabStructure(): Control.PanelOptions {
        return {
            id: this.getState().getId(),
            tab: this.getState().getIcon(),
            // the content of the pane needs to added after the render since it can contain event listeners
            pane: '<div class="' + C_sidebar_tab_content_class + '"></div>',
            title: ' ' + this.getState().getName(),
            position: 'top'
        };
    }

    /**
     * It creates the remaining parts of the sidebar tab after the sidebar tab is rendered.
     */
    protected postCreate(): void {
        // get rendered sidebar tab
        const tabElement: HTMLElement | null = document.getElementById(this.getState().getId());

        // create sidebar tab content
        if(tabElement) {
            const tabContentElements: HTMLCollectionOf<Element> = tabElement.getElementsByClassName(C_sidebar_tab_content_class);
            if(tabContentElements.length > 0) {

                this.createTabContent(tabContentElements[0]);

                // enable/disable button
                const tabHeaderElements: HTMLCollectionOf<Element> = tabElement.getElementsByClassName(C_sidebar_header_class);
                if(tabHeaderElements.length > 0) {
                    const tabHeader: Element = tabHeaderElements[0];
                    
                    // check button
                    if(this.getState().hasCheckButton()) {
                        // create enable button in sidebar tab header
                        const tabEnableBtn: HTMLInputElement = document.createElement("input");
                        tabEnableBtn.setAttribute("type", "checkbox");
                        tabEnableBtn.setAttribute("id", this.getState().getId() + '-enable-btn');
                        tabEnableBtn.onclick = () => {
                            // onclick event handler enables/disables its items
                            this.setChecked(tabEnableBtn.checked);
                        };
                        tabHeader.insertBefore(tabEnableBtn, tabHeader.firstChild);

                        if(this.getState().getTool()?.isEnabled()) {
                            tabEnableBtn.setAttribute(C_checked_class, "true");
                        }
                    }

                    // initial state
                    if(this.getState().getTool()?.isEnabled()) {
                        tabHeader.classList.add(C_enabled_class);
                        tabElement.classList.add(C_enabled_class);
                    }
                }
            }
        }
    }

    protected createTabContent(tabContent: Element): void {
        tabContent.appendChild(this.getTool().getMapForm().getContent());

        // append tab fragments if defined
        const tabFragments: ISidebarFragment[] | undefined = this.getState().getFragments();
        if(tabFragments) {
            for(let i = 0; i < tabFragments.length; i++) {
                tabContent.appendChild(tabFragments[i].getContent());
            }
        }

        if(!this.getState().getTool()?.isEnabled()) {
            // disable inputs
            d3select(tabContent).selectAll("input").attr("disabled", "true");
            d3select(tabContent).selectAll("select").attr("disabled", "true");
            d3select(tabContent).selectAll("button").attr("disabled", "true");
        }
    }

    /**
     * It redraws the content of the sidebar tab.
     */
    public redraw(): void {
        // get rendered sidebar tab
        const tabElement: HTMLElement | null = document.getElementById(this.getState().getId());

        // create sidebar tab content
        if(tabElement) {
            const tabContentElements: HTMLCollectionOf<Element> = tabElement.getElementsByClassName(C_sidebar_tab_content_class);
            if(tabContentElements.length > 0) {
                const tabContent: Element = tabContentElements[0];

                // remove current form inputs
                tabContent.innerHTML = "";

                // create new form inputs
                this.createTabContent(tabContentElements[0]);
            }
        }
    }

    /**
     * Functions changes layer state to enabled/disabled.
     *
     * @param checked
     */
    public setChecked(checked: boolean): void {
        const tool: IMapTool = this.getState().getTool();
        if(tool && checked != tool.isEnabled()) {
            // enable/disable sidebar tab
            const sidebarTab = d3select("#" + this.getState().getId());
            if(sidebarTab) {
                // emhasize tab
                sidebarTab.classed(C_enabled_class, checked);
                sidebarTab.select("." + C_sidebar_header_class).classed(C_enabled_class, checked);
                // enable sidebar inputs
                
                // disable eslint - we use any to simplify the code (it is correct to use it this way)
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const disabled = (checked ? null : "true") as any;
                sidebarTab.select("." + C_sidebar_tab_content_class).selectAll("input").attr("disabled", disabled);
                sidebarTab.select("." + C_sidebar_tab_content_class).selectAll("select").attr("disabled", disabled);
                sidebarTab.select("." + C_sidebar_tab_content_class).selectAll("button").attr("disabled", disabled);
            }

            // notify extended tab
            this.setTabContentChecked(checked);

            // update the tool state
            tool.setEnabled(checked);

            // notify fragments
            const fragments = this.getFragments();
            if(fragments) {
                for(const fragment of fragments) {
                    fragment.setFragmentContentChecked(checked);
                }
            }
        }
    }

    /**
     * Changes the state of the tool which is controled by this sidebar tab.
     *
     * This function can be extended if needed.
     *
     * @param checked
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
    public setTabContentChecked(checked: boolean): void {
    }
}
export default SidebarTab;
