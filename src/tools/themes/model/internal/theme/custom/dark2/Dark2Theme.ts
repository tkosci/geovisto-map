// Geovisto core
import {
    IMapTilesModel
} from '../../../../../../../index.core';

import BasicTheme from '../../basic/BasicTheme';
import IMapTheme from '../../../../types/theme/IMapTheme';

/**
 * This class defines a custom theme.
 * 
 * @author Jiri Hynek
 * @author Jakub Kachlik - advanced color model
 */
class Dark2Theme extends BasicTheme implements IMapTheme {

    /**
     * It initializes the dark theme.
     */
    public constructor() {
        super();
    }

    /**
     * It returns the theme type.
     */
    public getName(): string {
        return "dark2";
    }

    /**
     * This theme prefers dark colors.
     */
    public isDark(): boolean {
        return true;
    }

    /**
     * It returns the preferred base map.
     */
    public getBaseMap(): IMapTilesModel {
        return { 
            url: 'https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png',
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        };
    }
    /**
         * It returns theme font
         */
    public getFont(): string {
        return "Verdana, sans-serif";
    }

    /**
     * It returns primary, secondary and disabled foreground colors used for text color
     * @return {primary:color, secondary:color2, disabled:color3}
     */
    public getForegroundColors(): { primary: string, secondary: string, disabled: string } {
        return {
            primary: "#86d486",
            secondary: "#b3b3b3",
            disabled: "#b3b3b3"
        };
    }

    /**
     * It returns primary, secondary and disabled background colors
     * @return {primary:color, secondary:color, disabled:color}     
     */
    public getBackgroundColors(): { primary: string, secondary: string, disabled: string } {
        return {
            primary: "#1a1a1a",
            secondary: "rgb(102, 102, 102, 0.95)",
            disabled: "#f2f2f2"
        };
    }

    /**
     * It returns color used for highlight hovered item
     * @return {color}
     */
    public getHoverColor(): string {
        return "#cffccf";
    }

    /**
     * It returns 4 primary colors
     * monochrom - color used as color scale by changing its intensity
     * lineColor – easy visible color with high contrast
     * triadic1,2,3 - 3 triadic colors scheme (triadic not required but colors contrast recommended)
     * @return {monochrom:color, monochromaComplement:color, triadic1:color, triadic2:color, triadic3:color}
     */
    public getDataColors(): { lineColor: string, triadic1: string, triadic2: string, triadic3: string } {
        return {
            lineColor: "#009933",
            triadic1: "#ecec79",
            triadic2: "#e87d7d",
            triadic3: "#a3a3f5",
        };
    }

    /**
     * It returns text input colors
     * matchBg,matchFg- colors for match cases autocomplete
     * notMatchBg, notMatchFg- colors for not matching cases autocomplete
     * placeholder- color of placeholder
     * hover- color when hover object
     * @return {matchBg:color, matchFg:color, notMatchBg:color, notMatchFg:color, placeholder:color, hover:color}
     */
    public getTextInputColor(): { matchBg: string, matchFg: string, notMatchBg: string, notMatchFg: string, placeholder: string, hover: string } {
        return {
            matchBg: "#8c8c8c",
            matchFg: "#d9d9d9",
            notMatchBg: "#666666",
            notMatchFg: "#b3b3b3",
            placeholder: "#bfbfbf",
            hover: "rgb(0, 51, 0, 0.3)"
        };
    }
}
export default Dark2Theme;