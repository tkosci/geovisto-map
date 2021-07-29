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
class Light2Theme extends BasicTheme implements IMapTheme {

    /**
     * It initializes the light theme.
     */
    public constructor() {
        super();
    }

    /**
     * It returns the theme type.
     */
    public getName(): string {
        return "light2";
    }

    /**
     * It returns the preferred base map.
     */
    public getBaseMap(): IMapTilesModel {
        return { 
            url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        };
    }

    /**
     * It returns theme font
     */
    public getFont(): string {
        return "Georgia, serif";
    }

    /**
     * It returns primary, secondary and disabled foreground colors used for text color
     * @return {primary:color, secondary:color2, disabled:color3}
     */
    public getForegroundColors(): { primary: string, secondary: string, disabled: string } {
        return {
            primary: "#ffffff",
            secondary: "#1c1c1c",
            disabled: "#cccccc"
        };
    }

    /**
     * It returns primary, secondary and disabled background colors
     * @return {primary:color, secondary:color, disabled:color}     
     */
    public getBackgroundColors(): { primary: string, secondary: string, disabled: string } {
        return {
            primary: "#363636",
            secondary: "rgba(184, 184, 184, 0.82)",
            disabled: "#f2f2f2"
        };
    }

    /**
     * It returns color used for highlight hovered item
     * @return {color}
     */
    public getHoverColor(): string {
        return "rgba(255, 238, 0, 0.37)";
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
            lineColor: "#000000",
            triadic1: "#000000",
            triadic2: "#7a7a7a",
            triadic3: "#ffffff",
        };
    }
}
export default Light2Theme;