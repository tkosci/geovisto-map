import LayerToolSidebarTabDefaults from "./LayerToolSidebarTabDefaults";
import LayerToolSidebarTabState from "./LayerToolSidebarTabState";
import ILayerTool from "../../../../../../model/types/layer/ILayerTool";
import ILayerToolSidebarTabProps from "../../../types/tab/layer/ILayerToolSidebarTabProps";
import ILayerToolSidebarTab from "../../../types/tab/layer/ILayerToolSidebarTab";
import ILayerToolSidebarTabDefaults from "../../../types/tab/layer/ILayerToolSidebarTabDefaults";
import ILayerToolSidebarTabState from "../../../types/tab/layer/ILayerToolSidebarTabState";
import IMapDimension from "../../../../../../model/types/dimension/IMapDimension";
import LabeledAutocompleteFormInput from "../../../../../../model/internal/inputs/labeled/autocomplete/LabeledAutocompleteFormInput";
import IMapDomain from "../../../../../../model/types/domain/IMapDomain";
import IMapFormInput from "../../../../../../model/types/inputs/IMapFormInput";
import ILayerToolDimensions from "../../../../../../model/types/layer/ILayerToolDimensions";
import { ISidebarTabInitProps } from "../../../types/tab/ISidebarTabProps";
import ILayerToolSidebarTabConfig from "../../../types/tab/layer/ILayerToolSidebarTabConfig";
import AbstractSidebarTab from "../AbstractSidebarTab";

/**
 * This class provides controls for management of the layer sidebar tab.
 * 
 * @author Jiri Hynek
 */
abstract class AbstractLayerToolSidebarTab<T extends ILayerTool> extends AbstractSidebarTab<T> implements ILayerToolSidebarTab {

    /**
     * It creates abstract layer tool sidebar tab with respect to the given props.
     * 
     * @param props 
     */
    public constructor(props: ILayerToolSidebarTabProps | undefined) {
        super(props);
    }

    /**
     * It returns the props given by the programmer.
     */
    public getProps(): ILayerToolSidebarTabProps {
        return <ILayerToolSidebarTabProps> super.getProps();
    }
    
    /**
     * It returns default values of the sidebar tab.
     */
    public getDefaults(): ILayerToolSidebarTabDefaults {
        return <ILayerToolSidebarTabDefaults> super.getDefaults();
    }

    /**
     * It creates new defaults of the sidebar tab.
     */
    protected createDefaults(): ILayerToolSidebarTabDefaults {
        return <ILayerToolSidebarTabDefaults> new LayerToolSidebarTabDefaults();
    }

    /**
     * It returns the sidebar tab state.
     */
    public getState(): ILayerToolSidebarTabState {
        return <ILayerToolSidebarTabState> super.getState();
    }

    /**
     * It creates the sidebar tab state.
     */
    protected createState(): ILayerToolSidebarTabState {
        return <ILayerToolSidebarTabState> new LayerToolSidebarTabState(this);
    }

    /**
     * Overrides the super method.
     * 
     * @param initProps
     */
    public initialize(initProps: ISidebarTabInitProps<ILayerToolSidebarTabConfig, T>): this {
        return super.initialize(initProps);
    }

    /**
     * It updates selected input values according to the given dimensions.
     * 
     * This function is intended to be extended.
     * 
     * @param dimensions 
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
    public setInputValues(dimensions: ILayerToolDimensions): void {
    }

    /**
     * Help method which returns a new universal autocomplete input for the any dimension.
     * 
     * @param dimension
     */
    protected getAutocompleteInput(dimension: IMapDimension<IMapDomain>): IMapFormInput {
        // TODO
        // eslint-disable-next-line no-var, @typescript-eslint/no-this-alias
        var _this = this;
        return new LabeledAutocompleteFormInput({
            label: dimension.getName(),
            options: dimension.getDomainManager().getDomainNames(),
            onChangeAction: function(ev: Event) {
                _this.getTool().updateDimension(dimension, (<HTMLInputElement> ev.target).value, undefined);
            }
        });
    }
}
export default AbstractLayerToolSidebarTab;