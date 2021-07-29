// Geovisto core
import {
    IMapFormControl,
    IMapTool,
    MapObject
} from "../../../../../index.core";

import ISidebarFragment from "../../types/fragment/ISidebarFragment";
import ISidebarFragmentConfig from "../../types/fragment/ISidebarFragmentConfig";
import ISidebarFragmentDefaults from "../../types/fragment/ISidebarFragmentDefaults";
import { ISidebarFragmentProps, ISidebarFragmentInitProps } from "../../types/fragment/ISidebarFragmentProps";
import ISidebarFragmentState from "../../types/fragment/ISidebarFragmentState";
import SidebarFragmentDefaults from "./SidebarFragmentDefaults";
import SidebarFragmentState from "./SidebarFragmentState";
/**
 * This class provides tab fragment for a sidebar tab.
 * 
 * This class is intended to be extended.
 * 
 * @author Jiri Hynek
 */
class SidebarFragment<T extends IMapTool & IMapFormControl> extends MapObject implements ISidebarFragment {

    /**
     * It creates abstract sidebar fragment with respect to the given props.
     * 
     * @param props 
     */
    public constructor(props?: ISidebarFragmentProps) {
        super(props);
    }

    /**
     * It returns the props given by the programmer.
     */
    public getProps(): ISidebarFragmentProps {
        return <ISidebarFragmentProps> super.getProps();
    }
    
    /**
     * It returns default values of the sidebar fragment.
     */
    public getDefaults(): ISidebarFragmentDefaults {
        return <ISidebarFragmentDefaults> super.getDefaults();
    }

    /**
     * It creates new defaults of the sidebar fragment.
     */
    protected createDefaults(): ISidebarFragmentDefaults {
        return new SidebarFragmentDefaults();
    }

    /**
     * It returns the sidebar fragment state.
     */
    public getState(): ISidebarFragmentState {
        return <ISidebarFragmentState> super.getState();
    }

    /**
     * It creates the sidebar fragment state.
     */
    protected createState(): ISidebarFragmentState {
        return new SidebarFragmentState(this);
    }

    /**
     * Help function which returns the tool.
     */
    public getTool(): T {
        return <T> this.getState().getTool();
    }

    /**
     * Overrides the super method.
     * 
     * @param initProps
     */
    public initialize(initProps: ISidebarFragmentInitProps<ISidebarFragmentConfig, T>): this {
        return super.initialize(initProps);
    }

    /**
     * It returns the HTML content of the sidebar fragment.
     */
    public getContent(): HTMLDivElement {
        return this.getTool().getMapForm().getContent();
    }

    /**
     * This function is called after the sidebar tab is rendered in sidebar.
     */
    public postCreate(): this {
        return this;
    }

    /**
     * Changes the state of the tool which is controled by this sidebar tab.
     * 
     * @param checked 
     */
    public setFragmentContentChecked(checked: boolean): void {
        const tool: IMapTool = this.getState().getTool();
        if(tool && checked != tool.isEnabled()) {

            // update the tool state
            tool.setEnabled(checked);
        }
    }
}
export default SidebarFragment;