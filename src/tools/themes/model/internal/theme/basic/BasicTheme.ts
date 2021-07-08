// Geovisto core
import AbstractMapDomain from "../../../../../../model/internal/domain/abstract/AbstractMapDomain";
import IMapTilesModel from "../../../../../../model/types/tiles/IMapTilesModel";

import IMapTheme from "../../../types/theme/IMapTheme";

/**
 * This class provides basic implementation of a theme.
 * 
 * @author Jiri Hynek
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
    
}
export default BasicTheme;