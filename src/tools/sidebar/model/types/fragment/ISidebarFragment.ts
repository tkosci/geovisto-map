import ISidebarFragmentDefaults from "./ISidebarFragmentDefaults";
import IMapObject from "../../../../../model/types/object/IMapObject";
import { ISidebarFragmentProps, ISidebarFragmentInitProps } from "./ISidebarFragmentProps";
import ISidebarFragmentState from "./ISidebarFragmentState";
import ISidebarTab from "../tab/ISidebarTab";
import ISidebarFragmentConfig from "./ISidebarFragmentConfig";

/**
 * This interface declares a sidebar fragment for a sidebar tab.
 * 
 * @author Jiri Hynek
 */
interface ISidebarFragment<
    TProps extends ISidebarFragmentProps = ISidebarFragmentProps,
    TDefaults extends ISidebarFragmentDefaults = ISidebarFragmentDefaults,
    TState extends ISidebarFragmentState = ISidebarFragmentState,
    TConfig extends ISidebarFragmentConfig = ISidebarFragmentConfig,
    TInitProps extends ISidebarFragmentInitProps<TConfig> = ISidebarFragmentInitProps<TConfig>
> extends IMapObject<TProps, TDefaults, TState, TConfig, TInitProps> {

    /**
     * The function returns true if the sidebar fragment should be included in the sidebar tab.
     * 
     * @param sidebarTab 
     */
    isChild(sidebarTab: ISidebarTab): boolean

    /**
     * It returns the HTML content of the sidebar fragment.
     */
    getContent(): HTMLElement;
    /**
     * This function is called after the sidebar tab is rendered in sidebar.
     */
    postCreate(): this

    /**
     * Changes the state of the tool which is controled by this sidebar tab.
     * 
     * @param checked 
     */
    setFragmentContentChecked(checked: boolean): void;

}
export default ISidebarFragment;