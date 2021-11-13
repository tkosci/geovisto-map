import { IMapToolConfig, MapToolDefaults } from "../../../..";
import IHierarchyToolDefaults from "../types/IHierarchyToolDefaults";

class HierarchyToolDefaults extends MapToolDefaults implements IHierarchyToolDefaults {
    public static TYPE="geovisto-tool-hierarchy";

    public getType() : string {
      return HierarchyToolDefaults.TYPE;  
    }

    public isSingleton(): boolean {
      return true; 
   }
    
    public getLabel(): string {
      return "HierarchyLABEL";
  }

  public getIcon(): string {
    return '<i class="fa fa-database"></i>';
}
  
public getConfig(): IMapToolConfig {
    return super.getConfig();
}


}
export default HierarchyToolDefaults;