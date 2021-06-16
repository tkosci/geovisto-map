import MapThemesManager from "./internal/theme/basic/MapThemesManager";
import Dark1Theme from "./internal/theme/custom/dark1/Dark1Theme";
import Dark2Theme from "./internal/theme/custom/dark2/Dark2Theme";
import Dark3Theme from "./internal/theme/custom/dark3/Dark3Theme";
import Light1Theme from "./internal/theme/custom/light1/Light1Theme";
import Light2Theme from "./internal/theme/custom/light2/Light2Theme";
import Light3Theme from "./internal/theme/custom/light3/Light3Theme";
import ThemesTool from "./internal/tool/ThemesTool";
import ThemesToolDefaults from "./internal/tool/ThemesToolDefaults";
import IMapTheme from "./types/theme/IMapTheme";
import IMapThemesManager from "./types/theme/IMapThemesManager";
import IThemesTool from "./types/tool/IThemesTool";
import IThemesToolProps from "./types/tool/IThemesToolProps";

export const GeovistoThemesTool: {
    getType: () => string,
    createTool: (props?: IThemesToolProps) => IThemesTool,
    createThemesManager: (filterOperations: IMapTheme[]) => IMapThemesManager,
    createThemeLight1: () => IMapTheme,
    createThemeLight2: () => IMapTheme,
    createThemeLight3: () => IMapTheme,
    createThemeDark1: () => IMapTheme,
    createThemeDark2: () => IMapTheme,
    createThemeDark3: () => IMapTheme
} = {
    getType: () => ThemesToolDefaults.TYPE,
    createTool: (props) => new ThemesTool(props),
    createThemesManager: (filterOperations) => new MapThemesManager(filterOperations),
    createThemeLight1: () => new Light1Theme(),
    createThemeLight2: () => new Light2Theme(),
    createThemeLight3: () => new Light3Theme(),
    createThemeDark1: () => new Dark1Theme(),
    createThemeDark2: () => new Dark2Theme(),
    createThemeDark3: () => new Dark3Theme()
};