import ConnectionLayerTool from "./model/internal/tool/ConnectionLayerTool";
import ConnectionLayerToolDefaults from "./model/internal/tool/ConnectionLayerToolDefaults";
import IConnectionLayerTool from "./model/types/tool/IConnectionLayerTool";
import IConnectionLayerToolProps from "./model/types/tool/IConnectionLayerToolProps";

export const GeovistoConnectionLayerTool: {
    getType: () => string,
    createTool: (props?: IConnectionLayerToolProps) => IConnectionLayerTool
} = {
    getType: () => ConnectionLayerToolDefaults.TYPE,
    createTool: (props) => new ConnectionLayerTool(props),
};