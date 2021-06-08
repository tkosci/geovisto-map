import SidebarTool from "./internal/tool/SidebarTool";
import SidebarToolDefaults from "./internal/tool/SidebarToolDefaults";
import ISidebarTool from "./types/tool/ISidebarTool";
import ISidebarToolProps from "./types/tool/ISidebarToolProps";

export const GeovistoSidebarTool: {
    getType: () => string,
    createTool: (props: ISidebarToolProps | undefined) => ISidebarTool
} = {
    getType: () => SidebarToolDefaults.TYPE,
    createTool: (props) => new SidebarTool(props),
};