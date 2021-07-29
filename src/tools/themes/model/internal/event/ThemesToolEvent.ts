// Geovisto core
import {
    MapChangeEvent
 } from "../../../../../index.core";

import IMapTheme from "../../types/theme/IMapTheme";
import IThemesTool from "../../types/tool/IThemesTool";
import IThemesToolEvent from "../../types/event/IThemesToolEvent";
/**
 * This class provides the theme change event.
 * 
 * @author Jiri Hynek
 */
class ThemesToolEvent extends MapChangeEvent<IThemesTool, IMapTheme> implements IThemesToolEvent {

    /**
     * It initializes event.
     */
    public constructor(themesTool: IThemesTool, theme: IMapTheme) {
        super(ThemesToolEvent.TYPE(), themesTool, theme);
    }

    /**
     * Type of the event.
     */
    public static TYPE(): string {
        return "themes-tool-event";
    }
}
export default ThemesToolEvent;