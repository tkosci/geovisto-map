import ITilesLayerTool from "./model/types/tool/ITilesLayerTool";
import ITilesLayerToolProps from "./model/types/tool/ITilesLayerToolProps";
import TilesLayerTool from "./model/internal/tool/TilesLayerTool";
import TilesLayerToolDefaults from "./model/internal/tool/TilesLayerToolDefaults";

export const GeovistoTilesLayerTool: {
    getType: () => string,
    createTool: (props?: ITilesLayerToolProps) => ITilesLayerTool
} = {
    getType: () => TilesLayerToolDefaults.TYPE,
    createTool: (props) => new TilesLayerTool(props),
};