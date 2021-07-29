// Geovisto core
import {
    IMapTilesModel
} from '../../../../../../../index.core';

import BasicTheme from '../../basic/BasicTheme';
import IMapTheme from '../../../../types/theme/IMapTheme';

/**
 * This class wraps a filter operation.
 * 
 * @author Jiri Hynek
 * @author Jakub Kachlik - advanced color model
 */
class Light3Theme extends BasicTheme implements IMapTheme {

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
        return "light3";
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
    public getFont(): string  {
        return "Georgia, serif";
    }

    /**
     * It returns primary, secondary and disabled foreground colors used for text color
     * @return {primary:color, secondary:color2, disabled:color3}
     */
    public getForegroundColors(): { primary: string, secondary: string, disabled: string } {
        return {
            primary: "#3e3e3e",
            secondary: "#ffffff",
            disabled: "#cccccc"
        };
    }

    /**
     * It returns primary, secondary and disabled background colors
     * @return {primary:color, secondary:color, disabled:color}     
     */
    public getBackgroundColors(): { primary: string, secondary: string, disabled: string } {
        return {
            primary: "#e8e8e8",
            secondary: "rgba(122, 153, 156, 0.86)",
            disabled: "#f2f2f2"
        };
    }

    /**
     * It returns color used for highlight hovered item
     * @return {color}
     */
    public getHoverColor(): string {
        return "#9df1ff";
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
            lineColor: "#118993",
            triadic1: "rgba(255, 38, 8, 0.73)",
            triadic2: "rgba(235, 255, 28, 0.74)",
            triadic3: "#ffc341",
        };
    }
}
export default Light3Theme;