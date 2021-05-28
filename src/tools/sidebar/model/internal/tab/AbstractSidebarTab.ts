import * as d3 from "d3";
import MapObject from "../../../../../model/internal/object/MapObject";
import ISidebarTab from "../../types/tab/ISidebarTab";
import { ISidebarTabProps, ISidebarTabInitProps } from "../../types/tab/ISidebarTabProps";
import ISidebarTabDefaults from "../../types/tab/ISidebarTabDefaults";
import SidebarTabDefaults from "./SidebarTabDefaults";
import ISidebarTabState from "../../types/tab/ISidebarTabState";
import SidebarTabState from "./SidebarTabState";
import ISidebarTabConfig from "../../types/tab/ISidebarTabConfig";
import IMapTool from "../../../../../model/types/tool/IMapTool";
import ISidebarFragment from "../../types/fragment/ISidebarFragment";
import { Control } from "leaflet";
import ISidebarFragmentControl from "../../types/fragment/ISidebarFragmentControl";
import ISidebarFragmentConfig from "../../types/fragment/ISidebarFragmentConfig";

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
abstract class AbstractSidebarTab<T extends IMapTool> extends MapObject implements ISidebarTab {

    /**
     * It creates abstract sidebar tab with respect to the given props.
     * 
     * @param props 
     */
    public constructor(props: ISidebarTabProps | undefined) {
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
        // poor JavaScript...
        const instanceOfFragmentControl = function(tool: IMapTool | ISidebarFragmentControl): tool is ISidebarFragmentControl {
            return (tool as ISidebarFragmentControl).getSidebarFragment !== undefined;
        };

        // init help variables
        const fragments: ISidebarFragment[] = [];
        let fragment: ISidebarFragment;
        let fragmentTool: IMapTool | undefined;

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
                            if(fragmentTool && (instanceOfFragmentControl(fragmentTool))) {
                                fragment = (fragmentTool as ISidebarFragmentControl).getSidebarFragment();
                                if(fragment && fragment.isChild(this)) {
                                    fragment.initialize({ tool: fragmentTool, sidebarTab: this, config: fragmentConfig });
                                    fragments.push(fragment);
                                }
                            }
                        }
                    }
                } else {
                    // try to look for fragments if not specified in config
                    const tools: IMapTool[] = map.getState().getTools().getAll();
                    for(let i = 0; i < tools.length; i++) {
                        fragmentTool = tools[i];
                        if(instanceOfFragmentControl(fragmentTool)) {
                            fragment = (fragmentTool as ISidebarFragmentControl).getSidebarFragment();
                            if(fragment && fragment.isChild(this)) {
                                fragment.initialize({ tool: fragmentTool, sidebarTab: this, config: undefined });
                                fragments.push(fragment);
                            }
                        }
                    }
                }
            }
        }

        this.getState().setFragments(fragments);
    }

    /**
     * Creates sidebar tab.
     *
     */
    public create(): this {
        const state: ISidebarTabState = this.getState();
        const sidebar: Control.Sidebar | null = state.getSidebar();
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
                const tabContent: Element = tabContentElements[0];
                tabContent.appendChild(this.getContent());

                // append tab fragments if defined
                const tabFragments: ISidebarFragment[] | undefined = this.getState().getFragments();
                if(tabFragments) {
                    for(let i = 0; i < tabFragments.length; i++) {
                        tabContent.appendChild(tabFragments[i].getContent());
                    }
                }

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
                        // TODO
                        // eslint-disable-next-line no-var, @typescript-eslint/no-this-alias
                        var _this = this;
                        tabEnableBtn.onclick = function() {
                            // onclick event handler enables/disables its items
                            _this.setChecked(tabEnableBtn.checked);
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
                    } else {
                        // disable inputs
                        d3.select(tabContent).selectAll("input").attr("disabled", "true");
                        d3.select(tabContent).selectAll("select").attr("disabled", "true");
                        d3.select(tabContent).selectAll("button").attr("disabled", "true");
                    }
                }
            }
        }
    }

    /**
     * It returns tab pane which will be placed in sidebar tab.
     *
     * This function needs to be extended.
     */
    protected abstract getContent(): HTMLElement;

    /**
     * Functions changes layer state to enabled/disabled.
     *
     * @param checked
     */
    public setChecked(checked: boolean): void {
        const tool: IMapTool = this.getState().getTool();
        if(tool && checked != tool.isEnabled()) {
            // enable/disable sidebar tab
            const sidebarTab = d3.select("#" + this.getState().getId());
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

            // switch state
            this.setTabContentChecked(checked);

            // update the tool state
            tool.setEnabled(checked);
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
export default AbstractSidebarTab;
