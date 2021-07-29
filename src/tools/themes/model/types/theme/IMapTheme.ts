// Geovisto core
import {
    IMapDomain,
    IMapTilesModel
} from "../../../../../index.core";

/**
 * This interface declares a map theme API.
 * 
 * @author Jiri Hynek
 * @author Jakub Kachlik - advanced color model
 */
interface IMapTheme extends IMapDomain {

    /**
     * It returns the url of the preferred base map.
     */
    getBaseMap(): IMapTilesModel;

    /**
     * It returns if the styles preferres inversed dark colors.
     */
    isDark(): boolean;

    /**
     * It returns theme font
     */
    getFont(): string;

    /**
     * It returns primary, secondary and disabled foreground colors used for text color
     * @return {primary:color, secondary:color2, disabled:color3}
     */
    getForegroundColors(): { primary: string, secondary: string, disabled: string };

    /**
     * It returns primary, secondary and disabled background colors
     * @return {primary:color, secondary:color, disabled:color}     
     */
    getBackgroundColors(): { primary: string, secondary: string, disabled: string };


    /**
     * It returns highlight colors for selected, highlighted and deepasized (not selected or highlighted) objects
     * @return {selected:color, highlight:color, deempasize:color}
     */
    getHighlightColor(): { selected: string, highlight: string, deempasize: string };

    /**
     * It returns color used for highlight hovered item
     * @return {color}
     */
    getHoverColor(): string;

    /**
     * It returns 4 primary colors
     * lineColor – easy visible color with high contrast
     * triadic1,2,3 - 3 triadic colors scheme (triadic not required but colors contrast recommended)
     * @return {monochrom:color, monochromaComplement:color, triadic1:color, triadic2:color, triadic3:color}
     */
    getDataColors(): { lineColor: string, triadic1: string, triadic2: string, triadic3: string };

    /**
     * It returns text input colors
     * matchBg,matchFg- colors for match cases autocomplete
     * notMatchBg, notMatchFg- colors for not matching cases autocomplete
     * placeholder- color of placeholder
     * hover- color when hover object
     * @return {matchBg:color, matchFg:color, notMatchBg:color, notMatchFg:color, placeholder:color, hover:color}
     */
    getTextInputColor(): { matchBg: string, matchFg: string, notMatchBg: string, notMatchFg: string, placeholder: string, hover: string };
    
}
export default IMapTheme;