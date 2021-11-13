class HierarchyParent {
    private id: string;
    private zoomLevel: number;
    private childs: string[];


    public constructor(id:string, zoomLevel:number, childs: string[]) {
        this.childs = childs;
        this.id = id;
        this.zoomLevel = zoomLevel;
    }

    public getID() : string {
        return this.id;
    }

    public getZoomLevel() : number {
        return this.zoomLevel;
    }

    public getChilds() : string[] {
        return this.childs;
    }
}

export default HierarchyParent;