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
class MapyCZTheme extends BasicTheme implements IMapTheme {

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
        return "mapy.cz";
    }

    /**
     * It returns the preferred base map.
     */
    public getBaseMap(): IMapTilesModel {
        return { 
            url: 'https://mapserver.mapy.cz/turist-m/{z}-{x}-{y}',
            attribution: '&copy; <a href="https://licence.mapy.cz/?doc=mapy_pu">Mapy.cz</a>'
        };
    }
}
export default MapyCZTheme;