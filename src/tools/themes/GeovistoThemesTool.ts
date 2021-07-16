import BasicTheme from "./model/internal/theme/basic/BasicTheme";
import MapThemesManager from "./model/internal/theme/basic/MapThemesManager";
import Dark1Theme from "./model/internal/theme/custom/dark1/Dark1Theme";
import Dark2Theme from "./model/internal/theme/custom/dark2/Dark2Theme";
import Dark3Theme from "./model/internal/theme/custom/dark3/Dark3Theme";
import Light1Theme from "./model/internal/theme/custom/light1/Light1Theme";
import Light2Theme from "./model/internal/theme/custom/light2/Light2Theme";
import Light3Theme from "./model/internal/theme/custom/light3/Light3Theme";
import ThemesTool from "./model/internal/tool/ThemesTool";
import ThemesToolAPI from "./model/internal/tool/ThemesToolAPI";
import IMapTheme from "./model/types/theme/IMapTheme";
import IMapThemesManager from "./model/types/theme/IMapThemesManager";
import IThemesTool from "./model/types/tool/IThemesTool";
import { IThemesToolAPI } from "./model/types/tool/IThemesToolAPI";
import IThemesToolProps from "./model/types/tool/IThemesToolProps";

export const GeovistoThemesTool: IThemesToolAPI & {
    getType: () => string,
    createTool: (props?: IThemesToolProps) => IThemesTool,
    createThemesManager: (themes: IMapTheme[]) => IMapThemesManager,
    createThemeBasic: () => IMapTheme,
    createThemeLight1: () => IMapTheme,
    createThemeLight2: () => IMapTheme,
    createThemeLight3: () => IMapTheme,
    createThemeDark1: () => IMapTheme,
    createThemeDark2: () => IMapTheme,
    createThemeDark3: () => IMapTheme
} = { ...ThemesToolAPI,
    createTool: (props) => new ThemesTool(props),
    createThemesManager: (themes) => new MapThemesManager(themes),
    createThemeBasic: () => new BasicTheme(),
    createThemeLight1: () => new Light1Theme(),
    createThemeLight2: () => new Light2Theme(),
    createThemeLight3: () => new Light3Theme(),
    createThemeDark1: () => new Dark1Theme(),
    createThemeDark2: () => new Dark2Theme(),
    createThemeDark3: () => new Dark3Theme()
};