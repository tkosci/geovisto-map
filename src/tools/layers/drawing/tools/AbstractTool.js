import React from 'react';

type LocalProps = {
  drawingTool: object,
};

const NAME = 'abstract-drawing-tool';

class AbstractTool {
  constructor(props: LocalProps) {
    this.drawingTool = props.drawingTool;
    this.sidebar = props.drawingTool.getSidebarTabControl();
    this.leafletMap = props.drawingTool.getMap().getState().getLeafletMap();

    this.tool = null;
  }

  static NAME(): string {
    return NAME;
  }

  /**
   * to be extended
   */
  getName(): string {
    return NAME;
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

  /**
   * to be extended
   */
  enable(): void {
    this._redrawSidebar(this.result());
    console.log('enabled');
  }

  /**
   * to be extended
   */
  disable(): void {
    this._disableActive();
  }

  _disableActive(): void {
    let activeTool = this.tool;
    if (activeTool) {
      this.sidebar.getState().setEnabledEl(activeTool);
      this._redrawSidebar();
    }
  }
}

export default AbstractTool;
