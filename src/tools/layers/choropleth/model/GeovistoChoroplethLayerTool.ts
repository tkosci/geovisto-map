import ChoroplethLayerTool from "./internal/tool/ChoroplethLayerTool";
import ChoroplethLayerToolDefaults from "./internal/tool/ChoroplethLayerToolDefaults";
import IChoroplethLayerTool from "./types/tool/IChoroplethLayerTool";
import IChoroplethLayerToolProps from "./types/tool/IChoroplethLayerToolProps";

export const GeovistoChoroplethLayerTool: {
    getType: () => string,
    createTool: (props: IChoroplethLayerToolProps | undefined) => IChoroplethLayerTool
} = {
    getType: () => ChoroplethLayerToolDefaults.TYPE,
    createTool: (props) => new ChoroplethLayerTool(props),
};