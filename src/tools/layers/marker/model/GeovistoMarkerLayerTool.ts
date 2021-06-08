import MarkerLayerTool from "./internal/tool/MarkerLayerTool";
import MarkerLayerToolDefaults from "./internal/tool/MarkerLayerToolDefaults";
import IMarkerLayerTool from "./types/tool/IMarkerLayerTool";
import IMarkerLayerToolProps from "./types/tool/IMarkerLayerToolProps";

export const GeovistoMarkerLayerTool: {
    getType: () => string,
    createTool: (props: IMarkerLayerToolProps | undefined) => IMarkerLayerTool
} = {
    getType: () => MarkerLayerToolDefaults.TYPE,
    createTool: (props) => new MarkerLayerTool(props),
};