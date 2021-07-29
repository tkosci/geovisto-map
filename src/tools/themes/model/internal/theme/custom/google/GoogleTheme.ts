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
 */
class GoogleTheme extends BasicTheme implements IMapTheme {

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
        return "google";
    }

    /**
     * It returns the preferred base map.
     */
    public getBaseMap(): IMapTilesModel {
        return { 
            url: 'http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
            attribution: '&copy; <a href="https://cloud.google.com/maps-platform/terms">Google Maps Platform</a>',
            subdomains:['mt0','mt1','mt2','mt3']
        };
    }
}
export default GoogleTheme;