// Geovisto core
import {
    IMapObjectState,
    IMapTool
} from "../../../../../index.core";

import ISidebarFragment from "../fragment/ISidebarFragment";
import ISidebarTabConfig from "./ISidebarTabConfig";
import ISidebarTabDefaults from "./ISidebarTabDefaults";
import { ISidebarTabProps } from "./ISidebarTabProps";
import ISidebarTool from "../tool/ISidebarTool";

/**
 * This interface declares the state of the sidebar tab.
 * It wraps the state since the sidebar tab can work with state objects which needs to be explicitly serialized.
 * 
 * @author Jiri Hynek
 */
interface ISidebarTabState<
    TProps extends ISidebarTabProps = ISidebarTabProps,
    TDefaults extends ISidebarTabDefaults = ISidebarTabDefaults,
    TConfig extends ISidebarTabConfig = ISidebarTabConfig
> extends IMapObjectState<TProps, TDefaults, TConfig> {

    /**
     * It returns the tool property of the sidebar tab state.
     */
    getTool(): IMapTool;

    /**
     * It sets the tool property of the sidebar tab state.
     * 
     * @param tool 
     */
    setTool(tool: IMapTool): void;

    /**
     * It returns the enabled property of the sidebar tab state.
     */
    isEnabled(): boolean;

    /**
     * It sets the enabled property of the sidebar tab state.
     * 
     * @param enabled 
     */
    setEnabled(enabled: boolean): void;

    /**
     * It returns the name property of the sidebar tab state.
     */
    getName(): string;

    /**
     * It sets the name property of the sidebar tab state.
     * 
     * @param name 
     */
    setName(name: string): void;

    /**
     * It returns the icon property of the sidebar tab state.
     */
    getIcon(): string

    /**
     * It sets the icon property of the sidebar tab state.
     * 
     * @param icon
     */
    setIcon(icon: string): void;

    /**
     * It returns the checkButton property of the sidebar tab state.
     */
    hasCheckButton(): boolean;

    /**
     * It sets the checkButton property of the sidebar tab state.
     * 
     * @param checkButton 
     */
    setCheckButton(checkButton: boolean): void;

    /**
     * It returns the sidebar property of the sidebar tab state.
     */
    getSidebarTool(): ISidebarTool;

    /**
     * It sets the sidebar property of the sidebar tab state.
     * 
     * @param sidebar 
     */
    setSidebarTool(sidebar: ISidebarTool): void;

    /**
     * It returns the tabPane property of the sidebar tab state.
     */
    getContent(): HTMLElement | null;

    /**
     * It sets the tabPane property of the sidebar tab state.
     * 
     * @param content 
     */
    setContent(content: HTMLElement): void;

    /**
     * It returns the fragments property of the sidebar tab state.
     */
    getFragments(): ISidebarFragment[] | undefined;

    /**
     * It sets the fragments property of the sidebar tab state.
     * 
     * @param fragments 
     */
    setFragments(fragments: ISidebarFragment[]): void;
}
export default ISidebarTabState;