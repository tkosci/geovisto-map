// Geovisto core
import {
    IMapObjectState,
    IMapTool
} from "../../../../../index.core";

import ISidebarFragmentConfig from "./ISidebarFragmentConfig";
import ISidebarFragmentDefaults from "./ISidebarFragmentDefaults";
import { ISidebarFragmentProps } from "./ISidebarFragmentProps";
import ISidebarTab from "../tab/ISidebarTab";

/**
 * This interface declares the state of the sidebar fragment.
 * It wraps the state since the sidebar fragment can work with state objects which needs to be explicitly serialized.
 * 
 * @author Jiri Hynek
 */
interface ISidebarFragmentState<
    TProps extends ISidebarFragmentProps = ISidebarFragmentProps,
    TDefaults extends ISidebarFragmentDefaults = ISidebarFragmentDefaults,
    TConfig extends ISidebarFragmentConfig = ISidebarFragmentConfig
> extends IMapObjectState<TProps, TDefaults, TConfig> {

    /**
     * It returns the tool property of the sidebar tab fragment state.
     */
    getTool(): IMapTool;

    /**
     * It returns the enabled property of the sidebar tab fragment state.
     */
    isEnabled(): boolean;

    /**
     * It sets the enabled property of the sidebar tab fragment state.
     * 
     * @param enabled 
     */
    setEnabled(enabled: boolean): void;

    /**
     * It returns the sidenar tab property of the sidebar fragment state.
     */
    getSidebarTab(): ISidebarTab;

    /**
     * It sets the sidebar tab property of the sidebar tab contrfragmentol state.
     * 
     * @param sidebarTab 
     */
    setSidebarTab(sidebarTab: ISidebarTab): void;

    /**
     * It returns the content property of the sidebar tab framgent state.
     */
    getContent(): HTMLElement | null;

    /**
     * It sets the content property of the sidebar fragmemt tab state.
     * 
     * @param content 
     */
    setContent(content: HTMLElement): void;
}
export default ISidebarFragmentState;