import ITilesLayerTool from "./types/tool/ITilesLayerTool";
import ITilesLayerToolProps from "./types/tool/ITilesLayerToolProps";
import TilesLayerTool from "./internal/tool/TilesLayerTool";
import TilesLayerToolDefaults from "./internal/tool/TilesLayerToolDefaults";

export const GeovistoTilesLayerTool: {
    getType: () => string,
    createTool: (props: ITilesLayerToolProps | undefined) => ITilesLayerTool
} = {
    getType: () => TilesLayerToolDefaults.TYPE,
    createTool: (props) => new TilesLayerTool(props),
};