import ChoroplethLayerTool from "./model/internal/tool/ChoroplethLayerTool";
import ChoroplethLayerToolDefaults from "./model/internal/tool/ChoroplethLayerToolDefaults";
import IChoroplethLayerTool from "./model/types/tool/IChoroplethLayerTool";
import IChoroplethLayerToolProps from "./model/types/tool/IChoroplethLayerToolProps";

export const GeovistoChoroplethLayerTool: {
    getType: () => string,
    createTool: (props?: IChoroplethLayerToolProps) => IChoroplethLayerTool
} = {
    getType: () => ChoroplethLayerToolDefaults.TYPE,
    createTool: (props) => new ChoroplethLayerTool(props),
};