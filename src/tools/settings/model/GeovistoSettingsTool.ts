import SettingsTool from "./internal/tool/SettingsTool";
import SettingsToolDefaults from "./internal/tool/SettingsToolDefaults";
import ISettingsTool from "./types/tool/ISettingsTool";
import ISettingsToolProps from "./types/tool/ISettingsToolProps";

export const GeovistoSettingsTool: {
    getType: () => string,
    createTool: (props?: ISettingsToolProps) => ISettingsTool
} = {
    getType: () => SettingsToolDefaults.TYPE,
    createTool: (props) => new SettingsTool(props),
};