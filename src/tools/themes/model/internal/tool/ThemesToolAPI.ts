import IMapTheme from "../../types/theme/IMapTheme";
import { IThemesToolAPI } from "../../types/tool/IThemesToolAPI";
import ThemesToolDefaults from "./ThemesToolDefaults";
import ThemesToolEvent from "../event/ThemesToolEvent";

/**
 * API for Selection Tool.
 * 
 * @author Jiri Hynek
 */
const ThemesToolAPI: IThemesToolAPI = {
    getType: () => ThemesToolDefaults.TYPE,
    getChangeEventType: () => ThemesToolEvent.TYPE(),
    getTheme: () => undefined,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setTheme: (theme: IMapTheme) => { return; }
};
export default ThemesToolAPI;