// Geovisto core
import {
    ILayerToolDimensions,
    IMapForm,
    MapLayerToolForm
} from "../../../../../../index.core";

import ITilesLayerTool from "../../types/tool/ITilesLayerTool";

/**
 * This class provides functions for management of the layer sidebar tab.
 * 
 * @author Jiri Hynek
 */
class TilesLayerToolMapForm extends MapLayerToolForm<ITilesLayerTool> implements IMapForm {

    /**
     * It creates new map form with respect to the given props.
     * 
     * @param tool 
     */
    public constructor(tool: ITilesLayerTool) {
        super(tool);
    }

    /**
     * It updates selected input values according to the given dimensions.
     * 
     * @param dimensions 
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public setInputValues(dimensions: ILayerToolDimensions): void {
        return;
    }

    /**
     * It returns tab pane which will be placed in sidebar tab.
     */
    public getContent(): HTMLDivElement {
        // for now, it returns empty div element
        return document.createElement("div");
    }

    // TODO: This class should be modified in future to provide settings for Map layer (e.g., different tile layers).
}
export default TilesLayerToolMapForm;