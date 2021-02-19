import IMarkerLayerTool from "./model/types/tool/IMarkerLayerTool";
import IMarkerLayerToolProps from "./model/types/tool/IMarkerLayerToolProps";
import MarkerLayerTool from "./model/internal/tool/MarkerLayerTool";
import MarkerLayerToolDefaults from "./model/internal/tool/MarkerLayerToolDefaults";

export const GeovistoMarkerLayerTool: {
    getType: () => string,
    createTool: (props?: IMarkerLayerToolProps) => IMarkerLayerTool
} = {
    getType: () => MarkerLayerToolDefaults.TYPE,
    createTool: (props) => new MarkerLayerTool(props),
};