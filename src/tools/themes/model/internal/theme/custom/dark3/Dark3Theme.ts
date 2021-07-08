// Geovisto core
import IMapTilesModel from '../../../../../../../model/types/tiles/IMapTilesModel';

import BasicTheme from '../../basic/BasicTheme';
import IMapTheme from '../../../../types/theme/IMapTheme';

import './style.scss';

/**
 * This class defines a custom theme.
 * 
 * @author Jiri Hynek
 */
class Dark3Theme extends BasicTheme implements IMapTheme {

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
        return "dark3";
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
}
export default Dark3Theme;