import ConnectionLayerTool from "./internal/tool/ConnectionLayerTool";
import ConnectionLayerToolDefaults from "./internal/tool/ConnectionLayerToolDefaults";
import IConnectionLayerTool from "./types/tool/IConnectionLayerTool";
import IConnectionLayerToolProps from "./types/tool/IConnectionLayerToolProps";

export const GeovistoConnectionLayerTool: {
    getType: () => string,
    createTool: (props: IConnectionLayerToolProps | undefined) => IConnectionLayerTool
} = {
    getType: () => ConnectionLayerToolDefaults.TYPE,
    createTool: (props) => new ConnectionLayerTool(props),
};