import L from 'leaflet';
import 'leaflet-path-drag';
import 'leaflet-path-transform';
import 'leaflet-draw';

import { AbstractTool } from '../AbstractTool';
import { LayerType } from '../../model/types';
import { ToolProps } from '../AbstractTool/types';
import { TLineTool } from './types';

class LineTool extends AbstractTool implements TLineTool {
  constructor(props: ToolProps) {
    super(props);
  }

  public static NAME(): string {
    return 'line-drawing-tool';
  }

  public getName(): string {
    return LineTool.NAME();
  }

  public getIconName(): string {
    return 'fa fa-minus';
  }

  public getTitle(): string {
    return 'Line drawing tool';
  }

  public result = (): LayerType => {
    return 'polyline';
  };

  public canBeCanceled = (): boolean => {
    return true;
  };

  private _polylineCreate = (): void => {
    this.tool = new L.Draw.Polyline(this.leafletMap, {
      shapeOptions: {
        color: this.sidebar.getState().getSelectedColor(),
        weight: this.sidebar.getState().getSelectedStroke(),
        draggable: true,
        transform: true,
      },
      guideLayers: this.sidebar.getState().guideLayers,
      repeatMode: true,
    } as any);
    this.tool.enable();
  };

  public enable = (): void => {
    this._polylineCreate();
  };
}

export default LineTool;
