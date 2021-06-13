import IMapDomainArrayManager from "../domain/IMapDomainArrayManager";
import IGeoData from "./IGeoData";

/**
 * The type represents geographical data manager.
 * 
 * @author Jiri Hynek
 */
type IGeoDataManager = IMapDomainArrayManager<IGeoData>;
export default IGeoDataManager;