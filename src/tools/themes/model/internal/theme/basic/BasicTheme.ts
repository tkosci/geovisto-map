// Geovisto core
import {
    AbstractMapDomain,
    IMapTilesModel
} from "../../../../../../index.core";

import IMapTheme from "../../../types/theme/IMapTheme";

/**
 * This class provides basic implementation of a theme.
 * 
 * @author Jiri Hynek
 * @author Jakub Kachlik - advanced color model
 */
class BasicTheme extends AbstractMapDomain implements IMapTheme {

    /**
     * It initializes the theme.
     */
    public constructor() {
        super();
    }

    /**
     * It returns the theme type.
     */
    public getName(): string {
        return "basic";
    }

    /**
     * It returns the preferred base map.
     */
    public getBaseMap(): IMapTilesModel {
        return {
            url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 20,
            maxNativeZoom: 19,
            subdomains: undefined
        };
    }

    /**
     * It returns if the styles preferres inversed dark colors.
     */
    public isDark(): boolean {
        return false;
    }

    /**
     * It returns theme font
     */
    public getFont(): string {
        return "'Trebuchet MS', sans-serif";
    }

    /**
     * It returns primary, secondary and disabled foreground colors used for text color
     * @return {primary:color, secondary:color2, disabled:color3}
     */
    public getForegroundColors(): { primary: string, secondary: string, disabled: string } {
        return {
            primary: "white",
            secondary: "black",
            disabled: "rgba(240, 240, 240, 0.8)"
        };
    }

    /**
     * It returns primary, secondary and disabled background colors
     * @return {primary:color, secondary:color, disabled:color}     
     */
    public getBackgroundColors(): { primary: string, secondary: string, disabled: string } {
        return {
            primary: "rgba(55, 71, 79, 0.9)",
            secondary: "rgba(240, 240, 240, 0.8)",
            disabled: "rgba(55, 71, 79, 0.4)"
        };
    }


    /**
     * It returns highlight colors for selected, highlighted and deepasized (not selected or highlighted) objects
     * @return {selected:color, highlight:color, deempasize:color}
     */
    public getHighlightColor(): { selected: string, highlight: string, deempasize: string } {
        return {
            selected: "orange",
            highlight: "yellow",
            deempasize: "#8c8c8c",
        };
    }

    /**
     * It returns color used for highlight hovered item
     * @return {color}
     */
    public getHoverColor(): string {
        return "yellow";
    }

    /**
     * It returns 4 primary colors
     * lineColor – easy visible color with high contrast
     * triadic1,2,3 - 3 triadic colors scheme (triadic not required but colors contrast recommended)
     * @return {monochrom:color, monochromaComplement:color, triadic1:color, triadic2:color, triadic3:color}
     */
    public getDataColors(): { lineColor: string, triadic1: string, triadic2: string, triadic3: string } {
        return {
            lineColor: "slateblue",
            triadic1: "#c1c100",
            triadic2: "#c10000",
            triadic3: "#0006a7",
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
            matchBg: "white",
            matchFg: "black",
            notMatchBg: "#e6e6e6",
            notMatchFg: "#999999",
            placeholder: "#d9d9d9",
            hover: "#cccccc"
        };
    }
}
export default BasicTheme;