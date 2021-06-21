import ISidebarTool from "./model/types/tool/ISidebarTool";
import ISidebarToolProps from "./model/types/tool/ISidebarToolProps";
import SidebarTool from "./model/internal/tool/SidebarTool";
import SidebarToolDefaults from "./model/internal/tool/SidebarToolDefaults";

export const GeovistoSidebarTool: {
    getType: () => string,
    createTool: (props?: ISidebarToolProps) => ISidebarTool
} = {
    getType: () => SidebarToolDefaults.TYPE,
    createTool: (props) => new SidebarTool(props),
};