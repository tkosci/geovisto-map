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
class Light1Theme extends BasicTheme implements IMapTheme {

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
        return "light1";
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
}
export default Light1Theme;