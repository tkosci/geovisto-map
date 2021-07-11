type LocalProps = {
  drawingTool: object,
};

class AbstractTool {
  constructor(props: LocalProps) {
    this.drawingTool = props.drawingTool;
    this.sidebar = props.drawingTool.getSidebarTabControl();
    this.leafletMap = props.drawingTool.getMap().getState().getLeafletMap();

    this.tool = null;
    this._isActive = false;
  }

  static NAME(): string {
    return 'abstract-drawing-tool';
  }

  /**
   * to be extended
   */
  getName(): string {
    return AbstractTool.NAME();
  }

  /**
   * to be extended
   */
  getIconName(): string {
    return 'fa fa-pencil';
  }

  /**
   * to be extended
   */
  getTitle(): string {
    return 'Abstract drawing tool';
  }

  /**
   * to be extended
   */
  result(): string {
    return '';
  }

  canBeCanceled(): boolean {
    return false;
  }

  _redrawSidebar(type?: string): void {
    this.drawingTool.redrawSidebarTabControl(type);
  }

  setCurrentToolAsEnabled(): void {
    this.sidebar.getState().setEnabledTool(this);
  }

  /**
   * because I want to run setCurrentToolAsEnabled every time enabled is run I wrap it with this function
   */
  activate(): void {
    this.setCurrentToolAsEnabled();
    this.enable();
    this._isActive = true;
    this._redrawSidebar(this.result());
  }

  deactivate(): void {
    this.disable();
    this.tool = null;
    this._isActive = false;
    this.sidebar.getState().setEnabledTool(null);
    this._redrawSidebar();
  }

  /**
   * to be extended
   */
  enable(): void {
    this._redrawSidebar(this.result());
  }

  /**
   * to be extended
   */
  disable(): void {
    let activeTool = this.tool;
    if (activeTool) {
      activeTool.disable();
    }
  }

  /**
   *
   * @returns currently selected geo. object
   */
  getSelectedEl(): object {
    return this.drawingTool.getState().selectedLayer;
  }

  isToolActive(): boolean {
    return this._isActive;
  }
}

export default AbstractTool;
