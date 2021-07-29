// Geovisto core
import {
    IMapToolAPI
} from "../../../../../index.core";

import IMapTheme from "../theme/IMapTheme";

/**
 * Getter of the the Theme Tool API.
 * 
 * @author Jiri Hynek
 */
export type IThemesToolAPIGetter = {
    getGeovistoThemesTool: () => IThemesToolAPI;
}

/**
 * API for Theme Tool.
 * 
 * @author Jiri Hynek
 */
export type IThemesToolAPI = IMapToolAPI & {
    getChangeEventType: () => string,
    getTheme: () => IMapTheme | undefined,
    setTheme: (theme: IMapTheme) => void
}